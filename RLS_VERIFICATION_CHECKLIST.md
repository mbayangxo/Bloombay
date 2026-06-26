# RLS Verification Checklist

> **Manual test script** for staging (or local Supabase).  
> **Actors:** Member A, Member B, Admin (founder/moderator OK).  
> **Goal:** Prove Row Level Security blocks cross-member access on P0 tables.

**Last updated:** 2026-06-25  
**Companion:** `BETA_HARDENING_PLAN.md` Blocker 2 · `DATABASE_ARCHITECTURE.md`

---

## Prerequisites

| Item | Notes |
|------|-------|
| Environment | Staging Supabase + app deployed (migrations **115–118** applied recommended) |
| Member A | `member-a@staging.test` — note `user_id` (UUID) |
| Member B | `member-b@staging.test` — note `user_id` (UUID) |
| Admin | `admin@staging.test` with `profiles.role` in (`admin`, `founder`, `moderator`) |
| Tools | Browser (two profiles/incognito), Supabase SQL Editor (service role), optional `curl` with session cookies |

### Record sheet

| Test ID | Pass / Fail | Notes |
|---------|-------------|-------|
| | | |

---

## 1. Profiles

### 1.1 Member reads own profile

**As Member A** (authenticated):

1. Open Passport / profile settings in app, **or** run in browser console on app origin:
   ```js
   const sb = /* your supabase browser client */;
   const { data, error } = await sb.from("profiles").select("id, full_name, email, phone, role").eq("id", "<MEMBER_A_UUID>").single();
   console.log({ data, error });
   ```
2. **Expect:** Row returned; `id` matches Member A.

| ID | Result |
|----|--------|
| P-01 | ☐ Pass ☐ Fail |

### 1.2 Member cannot read another member's private fields

**As Member A**, query Member B by ID:

```js
const { data, error } = await sb.from("profiles").select("id, email, phone, gov_id_storage_path, verification_photo_url").eq("id", "<MEMBER_B_UUID>").maybeSingle();
```

**Expect:** Empty row, RLS error, or only intentionally public fields per `102_profile_privacy.sql` — **not** B's email/phone/gov-id paths.

| ID | Result |
|----|--------|
| P-02 | ☐ Pass ☐ Fail |

### 1.3 Member cannot escalate role

**As Member A:**

```js
const { error } = await sb.from("profiles").update({ role: "admin" }).eq("id", "<MEMBER_A_UUID>");
```

**Expect:** Error or zero rows updated; `profiles.role` still `member`.

| ID | Result |
|----|--------|
| P-03 | ☐ Pass ☐ Fail |

### 1.4 Admin can read profiles via staff API (not member JWT)

**As Admin**, use admin portal member lookup or service-role-backed API — **not** a forged member client.

**Expect:** Admin tooling can view member list; Member A JWT still cannot list all profiles unless policy allows public discovery fields only.

| ID | Result |
|----|--------|
| P-04 | ☐ Pass ☐ Fail |

---

## 2. Reports

> After Blocker 1: canonical table is `member_reports`. Before consolidation, also note `user_reports` behavior.

### 2.1 Member can insert report

**As Member A**, submit report against Member B via app UI or:

```bash
curl -X POST "$STAGING_APP/api/member/report" \
  -H "Cookie: <member_a_session>" \
  -H "Content-Type: application/json" \
  -d '{"reported_id":"<MEMBER_B_UUID>","reason":"spam","details":"RLS test"}'
```

**Expect:** `200` / `{ ok: true }`.

| ID | Result |
|----|--------|
| R-01 | ☐ Pass ☐ Fail |

### 2.2 Reporter sees own reports only

**As Member A:**

```js
const { data } = await sb.from("member_reports").select("id, reported_id, reason").order("created_at", { ascending: false });
```

**Expect:** Only A's submitted reports; all `reporter_id = MEMBER_A_UUID`.

| ID | Result |
|----|--------|
| R-02 | ☐ Pass ☐ Fail |

### 2.3 Member cannot read another member's reports

**As Member B:**

```js
const { data, error } = await sb.from("member_reports").select("*").eq("reporter_id", "<MEMBER_A_UUID>");
```

**Expect:** Empty set (RLS blocks).

| ID | Result |
|----|--------|
| R-03 | ☐ Pass ☐ Fail |

### 2.4 Member cannot select moderation queue

**As Member A:**

```js
const { data, error } = await sb.from("moderation_cases").select("*").limit(5);
```

**Expect:** Error or empty — table has **no member policies** (service role only).

| ID | Result |
|----|--------|
| R-04 | ☐ Pass ☐ Fail |

### 2.5 Staff sees cases via API

**As Admin**, open Safety Center or:

```bash
curl "$STAGING_APP/api/admin/moderation/cases" -H "Cookie: <admin_session>"
```

**Expect:** JSON `cases` array (may be empty).

| ID | Result |
|----|--------|
| R-05 | ☐ Pass ☐ Fail |

---

## 3. Girlmates

### 3.1 Messages isolated to conversation participants

**Setup:** Member A and Member B each have girlmate profiles; create a message thread A ↔ B if none exists.

**As Member A**, read messages:

```js
const { data } = await sb.from("girlmate_messages").select("id, sender_id, recipient_id, body").order("created_at", { ascending: false }).limit(20);
```

**Expect:** Only messages where A is sender or recipient.

| ID | Result |
|----|--------|
| G-01 | ☐ Pass ☐ Fail |

### 3.2 Member C cannot read A–B thread

**As a third member** (or B reading A's outbound-only filter incorrectly):

Query messages where A and B are participants but session user is neither.

**Expect:** No rows.

| ID | Result |
|----|--------|
| G-02 | ☐ Pass ☐ Fail |

### 3.3 Girlmate profile write own only

**As Member A**, attempt update on B's `girlmate_profiles` row:

```js
const { error } = await sb.from("girlmate_profiles").update({ bio: "hacked" }).eq("user_id", "<MEMBER_B_UUID>");
```

**Expect:** RLS blocks update.

| ID | Result |
|----|--------|
| G-03 | ☐ Pass ☐ Fail |

---

## 4. Messages (direct / conversations)

If `direct_messages` or `conversations` are enabled in your staging schema:

### 4.1 Direct messages participant-only

**As Member A**, list recent messages — only threads including A.

| ID | Result |
|----|--------|
| M-01 | ☐ Pass ☐ Fail |

### 4.2 Cannot insert message as another user

```js
const { error } = await sb.from("girlmate_messages").insert({
  sender_id: "<MEMBER_B_UUID>",
  recipient_id: "<MEMBER_A_UUID>",
  body: "spoofed"
});
```

**Expect:** RLS violation (`sender_id` must equal `auth.uid()`).

| ID | Result |
|----|--------|
| M-02 | ☐ Pass ☐ Fail |

---

## 5. Government IDs & verification photos

### 5.1 Member uploads own gov ID only

**As Member A**, upload via `POST /api/member/upload/government-id` (test image).

**Expect:** `200`; `profiles.gov_id_storage_path` set for A only.

| ID | Result |
|----|--------|
| V-01 | ☐ Pass ☐ Fail |

### 5.2 Member cannot access admin gov-id endpoint

**As Member A:**

```bash
curl "$STAGING_APP/api/admin/government-id?userId=<MEMBER_B_UUID>" -H "Cookie: <member_a_session>"
```

**Expect:** `403 Forbidden`.

| ID | Result |
|----|--------|
| V-02 | ☐ Pass ☐ Fail |

### 5.3 Admin gov-id access audited

**As Admin**, fetch gov-id URL for Member A; then in SQL Editor (service role):

```sql
SELECT action, resource_type, resource_id, actor_id, created_at
FROM admin_audit_logs
WHERE action = 'private_file_access'
ORDER BY created_at DESC
LIMIT 5;
```

**Expect:** Row with `resource_type = government_id`, `resource_id` = Member A UUID, `actor_id` = Admin UUID.

| ID | Result |
|----|--------|
| V-03 | ☐ Pass ☐ Fail |

### 5.4 No public URL for private bucket object

1. Note `gov_id_storage_path` for Member A (service role or admin API).
2. Construct naive public URL: `https://<project>.supabase.co/storage/v1/object/public/government-ids/<path>`
3. Open in incognito without auth.

**Expect:** 400/403/404 — bucket is not public.

| ID | Result |
|----|--------|
| V-04 | ☐ Pass ☐ Fail |

### 5.5 Verification selfie — same as gov-id

Repeat V-02–V-04 for `GET /api/admin/verification-photo?userId=...` after Blocker 5 ships. Until then, document if GET lacks audit (known gap).

| ID | Result |
|----|--------|
| V-05 | ☐ Pass ☐ Fail ☐ N/A |

---

## 6. Moderation (staff actions)

### 6.1 Member cannot PATCH moderation cases

**As Member A:**

```bash
curl -X PATCH "$STAGING_APP/api/admin/moderation/cases" \
  -H "Cookie: <member_a_session>" \
  -H "Content-Type: application/json" \
  -d '{"id":"<CASE_UUID>","action":"resolve"}'
```

**Expect:** `401` or `403`.

| ID | Result |
|----|--------|
| MOD-01 | ☐ Pass ☐ Fail |

### 6.2 Ban requires founder

**As Moderator-only** (if available), attempt `action: "ban"`.

**Expect:** `403` unless founder (per `requireFounder`).

| ID | Result |
|----|--------|
| MOD-02 | ☐ Pass ☐ Fail ☐ N/A |

### 6.3 Resolve writes audit log

**As Admin**, resolve a test case; verify `admin_audit_logs` has `moderation.resolve` (or `moderation.dismiss`).

| ID | Result |
|----|--------|
| MOD-03 | ☐ Pass ☐ Fail |

---

## 7. Plans (`bloomies_plans`)

### 7.1 Creator can CRUD own plan

**As Member A**, create a plan via Plans UI or API.

**Expect:** Success; `creator_id = MEMBER_A_UUID`.

| ID | Result |
|----|--------|
| PL-01 | ☐ Pass ☐ Fail |

### 7.2 Member cannot update another's plan

**As Member B**, with plan ID owned by A:

```js
const { error } = await sb.from("bloomies_plans").update({ title: "hijacked" }).eq("id", "<PLAN_A_UUID>");
```

**Expect:** RLS blocks (zero rows or error).

| ID | Result |
|----|--------|
| PL-02 | ☐ Pass ☐ Fail |

### 7.3 Invitees see plan only when policy allows

If plan invites exist: Member B invited to A's plan can read; Member C cannot.

| ID | Result |
|----|--------|
| PL-03 | ☐ Pass ☐ Fail ☐ N/A |

---

## 8. Reservations (`seat_reservations`)

### 8.1 Member sees own reservations

**As Member A** with an active gathering reservation:

```js
const { data } = await sb.from("seat_reservations").select("id, gathering_id, user_id, status");
```

**Expect:** Only rows where `user_id = MEMBER_A_UUID`.

| ID | Result |
|----|--------|
| RS-01 | ☐ Pass ☐ Fail |

### 8.2 Member cannot read B's reservation

**As Member A:**

```js
const { data } = await sb.from("seat_reservations").select("*").eq("user_id", "<MEMBER_B_UUID>");
```

**Expect:** Empty.

| ID | Result |
|----|--------|
| RS-02 | ☐ Pass ☐ Fail |

### 8.3 Reserve seat flow respects capacity

**As Member A**, reserve seat on a gathering via `POST /api/irl/reserve` or app.

**Expect:** Row created; gathering `seats_remaining` decrements; no duplicate active reservation (unique index).

| ID | Result |
|----|--------|
| RS-03 | ☐ Pass ☐ Fail |

### 8.4 Member cannot cancel B's reservation

```js
const { error } = await sb.from("seat_reservations").update({ status: "cancelled" }).eq("user_id", "<MEMBER_B_UUID>");
```

**Expect:** RLS blocks.

| ID | Result |
|----|--------|
| RS-04 | ☐ Pass ☐ Fail |

---

## Sign-off

| Field | Value |
|-------|-------|
| Environment | |
| Date | |
| Operator | |
| Migrations applied (115–118) | ☐ Yes ☐ Partial ☐ No |
| Blocker 1 (reports) shipped | ☐ Yes ☐ No |
| P0 failures (count) | |
| Issues filed | |

**P0 test IDs:** P-01–P-03, R-01–R-04, G-01–G-03, V-01–V-04, MOD-01, PL-02, RS-01–RS-02

All P0 must pass before production beta launch. P1 (remaining rows) should pass or have documented exceptions approved by founder.
