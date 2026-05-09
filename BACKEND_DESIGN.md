# Enterprise SaaS Backend Architecture Design

## 1. Modular Structure
Hệ thống được chia thành các module độc lập về logic để dễ dàng mở rộng thành Microservices trong tương lai.

### A. Auth & Identity Module
- **Trách nhiệm**: Quản lý Authentication (JWT), MFA, và Session.
- **Bảng chính**: `users`, `refresh_tokens`.
- **Security**: Argon2 hashing, JWT rotation.

### B. RBAC & Permissions Module
- **Trách nhiệm**: Quản lý Role, Permission và Scope-based access.
- **Bảng chính**: `roles`, `permissions`, `role_permissions`, `user_roles`.
- **Logic**: Hỗ trợ phân quyền theo cấp độ Tổ chức (Organization) và Dự án (Project).

### C. Assets & Projects Module
- **Trách nhiệm**: Quản lý danh mục đầu tư và tài sản.
- **Bảng chính**: `projects`, `assets`, `valuations`.
- **Consistency**: Đảm bảo tính nhất quán dữ liệu qua Foreign Keys và Transactions.

### D. Audit & Compliance Module
- **Trách nhiệm**: Lưu vết mọi hành động hệ thống.
- **Bảng chính**: `audit_logs` (Lưu trữ bất biến).
- **Constraint**: Chỉ cho phép INSERT, không cho phép UPDATE/DELETE trên bảng log.

## 2. Database Schema (PostgreSQL Focus)

```sql
-- Role-Based Access Control
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Trail
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id VARCHAR(50),
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Trigger to prevent deletions/updates on audit_logs should be implemented at DB level
```

## 3. Security Strategy
- **IDOR Protection**: Mọi truy vấn resource phải bao gồm check `WHERE project_id IN (...)`.
- **Audit Frequency**: 100% các mutation APIs (POST/PUT/DELETE) phải ghi log.
- **Rate Limiting**: Áp dụng trên Auth và Report Export endpoints.
