# Enterprise Workflow & State Consistency Design

## 1. Domain State Machines

Đảm bảo tính toàn vẹn dư liệu thông qua việc định nghĩa các trạng thái (states) và các bước chuyển (transitions) nghiêm ngặt.

### A. Asset Life-cycle
- **DRAFT**: Tài sản mới khởi tạo, chỉ có thể xem bởi người tạo.
- **PENDING_VALUATION**: Đang chờ định giá độc lập.
- **ACTIVE**: Đã xác minh, được tính vào tổng AUM.
- **DORMANT**: Tạm ngưng giao dịch nhưng vẫn thuộc sở hữu.
- **LIQUIDATED**: Đã thanh lý, dữ liệu chuyển vào Historical Snapshots.

### B. Approval Flow States
- **SUBMITTED**: Chờ cấp 1 phê duyệt.
- **UNDER_REVIEW**: Đang được thẩm định/audit.
- **REQUESTED_CHANGES**: Cần bổ sung hồ sơ.
- **APPROVED**: Phê duyệt cuối cùng.
- **REJECTED**: Bị từ chối (kèm lý do và audit log).

## 2. Approval Engine Logic

### Quy tắc ngưỡng (Threshold Rules)
- **TH-1 (< $100k)**: Một quản lý cấp trung (Manager) có thể phê duyệt.
- **TH-2 ($100k - $1M)**: Cần 2 chữ ký (Finance Director + Global Head).
- **TH-3 (> $1M)**: Board Committee phê duyệt + External Audit verification.

### Ngăn chặn Bypass (Anti-Bypass)
- Mọi bước chuyển sang trạng thái `APPROVED` phải đi qua function `processApprovalChain()`.
- Chặn mutation trực tiếp vào cột `status` trong Database.

## 3. Data Consistency & Concurrency

### A. Anti-Double-Counting
- Sử dụng **Materialized Views** cho báo cáo AUM, làm mới (refresh) qua Event Triggers khi một tài sản chuyển sang trạng thái `ACTIVE`.
- Mỗi tài sản phải có một `owner_id` duy nhất và hợp lệ tại mọi thời điểm.

### B. Race Condition Handling
- **Optimistic Locking**: Sử dụng cột `version_number` (integer). Mỗi bản cập nhật phải đi kèm `WHERE version_number = current_version`.
- **Database Transactions**: Mọi thay đổi trạng thái và ghi log audit phải nằm trong cùng một `BEGIN...COMMIT` block.

## 4. Event-Driven Architecture

| Event Type | Trigger | Consumer |
|------------|---------|----------|
| `ASSET_VALUATION_CHANGED` | Update action | Notification Service, Reporting Engine |
| `APPROVAL_REQUESTED` | Status → PENDING | Push Notification to Authorized Signatory |
| `OWNERSHIP_TRANSFERRED` | Legal approval | Audit Log, Tax Reporting Engine |

## 5. Security & Integrity Checks

- **Idempotency**: Mọi API Approval phải đính kèm `request_id` để tránh việc nhấn nút 2 lần gây ra double-approval/execution.
- **Immutable Snapshots**: Khi kỳ báo cáo (Reporting Period) kết thúc, hệ thống tạo bản sao cứng (Blob storage + Signed Hash) và đánh dấu bản ghi gốc là `LOCKED`.
