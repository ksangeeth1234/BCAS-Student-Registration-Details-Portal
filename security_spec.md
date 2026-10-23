# Security Specification for BCAS Student Registration Details Portal

## 1. Data Invariants
1. Students cannot overwrite administrative fields (such as `StudentNumber`, `Course`, `AcademicBranch`, `PaymentPendingStatus`, `status`, etc.).
2. Master Excel import, workbook metadata, and audit log inspection are strictly restricted to authenticated Administrators (`admins/{adminId}` where user email or UID exists).
3. Public / unauthenticated users cannot delete, batch-create, or manipulate student documents.
4. Updates to student records can only modify permitted fields (e.g. `mobile`, `email`, `address`, `dob`, `citizenship`, `parentName`, `parentMobile`, `qualifications`, `hasSpecialNeeds`, `specialNeedsReason`, `updatedAt`, `lastUpdatedBy`).
5. Only authenticated admins or verified access can perform administrative updates.
6. The bootstrapped admin `ksangeeth179@gmail.com` has administrator access to manage workbooks, audit logs, and settings.

## 2. The "Dirty Dozen" Payloads (Designed to Break Identity, Integrity, and State)
1. Unauthenticated attacker attempts to delete a student record.
2. Unauthenticated attacker attempts to overwrite all student records.
3. Non-admin user attempts to upload a workbook metadata document.
4. Non-admin user attempts to delete an audit log document.
5. Student update payload attempts to modify `StudentNumber` (immutable).
6. Student update payload attempts to modify `Course` (restricted administrative field).
7. Student update payload attempts to modify `PaymentPendingStatus` (restricted financial field).
8. Student update payload attempts to modify `status` (restricted administrative status).
9. Student update payload attempts to inject malicious shadow fields not declared in the student schema.
10. Unauthenticated user attempts to elevate themselves to admin in `/admins/{uid}`.
11. Unauthenticated user attempts to delete settings document `/settings/global`.
12. Attacker attempts path traversal or excessively oversized strings into student ID.

## 3. Test Runner
See `firestore.rules.test.ts` for validation assertions ensuring every "Dirty Dozen" payload returns `PERMISSION_DENIED`.
