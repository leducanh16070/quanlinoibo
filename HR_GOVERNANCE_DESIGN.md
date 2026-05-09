# Human Resource & Workforce Governance Design

## 1. Core Identity & Profile Separation

Hệ thống phân biệt rõ ràng giữa **Tài khoản người dùng (User Account)** và **Hồ sơ nhân sự (Employee/Partner Profile)**.

### A. Phân loại đối tượng (Workforce Types)
- **Employee**: Nhân sự chính thức, thuộc biên chế, có reporting line.
- **Contractor**: Nhân sự thuê ngoài, có thời hạn hợp đồng, scope truy cập giới hạn.
- **External Partner**: Đối tác chiến lược, truy cập project cụ thể.
- **Advisor**: Cố vấn cấp cao, quyền xem xét (Read-only) nhưng scope rộng.
- **Auditor**: Kiểm toán viên, truy cập tạm thời vào Audit Vault.

### B. Trạng thái vòng đời (Employee Lifecycle)
- `ONBOARDING`: Đang hoàn thiện hồ sơ.
- `ACTIVE`: Có quyền truy cập hệ thống.
- `SUSPENDED`: Tạm khóa quyền (vi phạm hoặc nghỉ phép dài hạn).
- `RESIGNED/TERMINATED`: **Ngắt kết nối ngay lập tức** khỏi mọi quyền truy cập (Immediate Revocation).

## 2. Organizational Structure (Hierarchy)

Cấu trúc phân cấp đảm bảo tính kế thừa quyền lực và luồng phê duyệt:

- **Level 1**: Company (Legal Entity)
- **Level 2**: Division (e.g., Wealth Management, Tech)
- **Level 3**: Department (e.g., Asset Operations, Legal)
- **Level 4**: Team
- **Reporting Line**: Mỗi nhân sự phải có một `manager_id` (trừ CEO).

## 3. Access & Approval Governance

### A. Quyền truy cập theo Scope (Scoped Access)
- **Global**: Super Admin.
- **Departmental**: Trưởng bộ phận xem toàn bộ data của phòng.
- **Team-based**: Manager xem data của team.
- **Individual**: Nhân viên chỉ xem data được assign trực tiếp.

### B. Ngưỡng phê duyệt tài chính (Financial Approval Limits)
- Hệ thống định nghĩa `approval_limit` cho từng chức danh:
  - Junior: $0 (Chỉ đề xuất).
  - Senior: $10,000.
  - Director: $500,000.
  - Board: Không giới hạn.

## 4. Database Relationships (PostgreSQL)

```sql
CREATE TABLE departments (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  parent_id UUID REFERENCES departments(id),
  head_id UUID -- References employee_profiles
);

CREATE TABLE employee_profiles (
  id UUID PRIMARY KEY,
  user_id UUID UNIQUE REFERENCES users(id),
  manager_id UUID REFERENCES employee_profiles(id),
  department_id UUID REFERENCES departments(id),
  job_title VARCHAR(100),
  status VARCHAR(20) DEFAULT 'ACTIVE',
  approval_limit DECIMAL DEFAULT 0,
  joined_at TIMESTAMPTZ,
  terminated_at TIMESTAMPTZ
);
```

## 5. Security & Risk Mitigation

- **Terminated User Guard**: Một `Pre-Request Middleware` sẽ kiểm tra trạng thái `employee_profile.status`. Nếu không phải `ACTIVE`, JWT sẽ bị coi là vô hiệu dù còn hạn.
- **Broken Hierarchy Detection**: Chặn việc tạo vòng lặp trong reporting line (A báo cáo B, B báo cáo A).
- **Privilege Escalation Protection**: Chỉ người có `role` cao hơn `target_role` mới được thay đổi quyền hạn của người khác.
