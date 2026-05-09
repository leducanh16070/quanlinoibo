# Data Creation & Integrity Design

## 1. Entity Definitions

### A. Person / Employee
- **Dữ liệu định danh**: Họ tên, Ngày sinh, Quốc tịch, Số định danh (Passport/ID).
- **Dữ liệu hệ thống**: Email công ty, Role (RBAC), Trạng thái KYC.
- **Ràng buộc**: Email phải là duy nhất. KYC phải 'Approved' trước khi được gán quyền Signatory.

### B. Legal Entity (Company/Holding)
- **Dữ liệu pháp lý**: Tên đăng ký, Mã số doanh nghiệp (UEN/TIN), Jurisdiction (Singapore, HK, etc.).
- **Quản trị**: Danh sách Directors, Đai diện pháp luật (Legal Rep).
- **Phân loại**: SPV, Holding, Operating Company.
- **Ràng buộc**: Không được phép trùng Mã số doanh nghiệp trong cùng một Jurisdiction.

### C. Asset
- **Phân loại**: Bất động sản, Cổ phần tư nhân (Equity), Kim loại quý, Du thuyền, v.v.
- **Định giá**: Giá trị sổ sách, Đơn vị tiền tệ.
- **Sở hữu**: **Bắt buộc** phải có ít nhất một Legal Entity hoặc Person là 'Direct Owner'.

## 2. Creation Flows & Validation Logic

### Flow 1: Corporate Entity Onboarding
1. **Input**: Tên công ty, Jurisdiction, UEN.
2. **BRE Check**: Kiểm tra Jurisdiction có nằm trong danh sách trắng (Whitelist) không? (Ví dụ: Chặn các vùng cấm vận).
3. **Structure Validation**: 
   - Tổng sở hữu của các Shareholders phải đúng 100%.
   - Chặn sở hữu chéo (A sở hữu B, B sở hữu A) - Circular Ownership Detection.
4. **Audit**: Ghi lại log 'ENTITY_CREATED' kèm theo Snapshot dữ liệu ban đầu.

### Flow 2: Asset Acquisition
1. **Input**: Loại tài sản, Giá trị, OwnerID.
2. **Owner Validation**: 
   - Kiểm tra `OwnerID` có tồn tại và đang ở trạng thái 'Active'.
   - Nếu Owner là 'Trust', kiểm tra quyền hạn của Trustee.
3. **Draft State**: Mọi tài sản mới tạo mặc định ở trạng thái `DRAFT` (Workflow: PENDING_APPROVAL).

## 3. Ownership Integrity Rules

| Rule ID | Name | Logic | Error if Failed |
|---------|------|-------|-----------------|
| `OWN-01` | No Orphan Assets | `asset.owner_id` must reference valid `entity_id` | `CORRUPT_ORPHAN_DATA` |
| `OWN-02` | Cap 100% | `sum(ownership_shares) <= 100` | `INVALID_SHARE_PCT` |
| `OWN-03` | Anti-Circular | Graph traversal to detect loops in ownership tree. | `CIRCULAR_OWNERSHIP_DETECTED` |
| `OWN-04` | UBO Link | Every entity must eventually trace back to a `Person` (Ultimate Beneficial Owner). | `UBO_TRACABILITY_MISSING` |

## 4. Implementation Strategy (Backend)

- **PostgreSQL Transactions**: Sử dụng transaction khi tạo Entity kèm theo Ownership record đồng thời.
- **Recursive CTE**: Sử dụng truy vấn đệ quy trong Postgres để kiểm tra cấu trúc sở hữu tầng và phát hiện vòng lặp.
- **Soft Delete**: Không xóa cứng bản ghi. Đánh dấu `deleted_at` để bảo toàn Audit Trail cho báo cáo lịch sử.
