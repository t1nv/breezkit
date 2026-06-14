---
name: trail-of-bits-security
description: Security audit, static analysis, and vulnerability detection using Trail of Bits methodology. CodeQL/Semgrep query patterns, smart contract auditing, and cryptographic implementation review.
version: 1.0.0
category: security
triggers:
  - security audit
  - vulnerability
  - static analysis
  - CodeQL
  - Semgrep
  - smart contract audit
  - code review
  - cryptography review
  - threat modeling
max_context_tokens: 4000
---

# Trail of Bits Security

Apply institutional-grade security review methodology from Trail of Bits — one of the world's most respected security research firms. This skill loads their systematic approach to code auditing: structured vulnerability classification, static analysis patterns, and professional audit documentation.

## When to Use

- Audit smart contracts (Solidity, Cairo, Solana, TON, Cosmos, Substrate)
- Review cryptographic implementations for timing side-channels and constant-time violations
- Analyze authentication and authorization systems
- Generate Semgrep or CodeQL rules for custom vulnerability patterns
- Perform differential security review of code changes
- Write professional security audit findings

## Methodology

### Phase 1: Context Building
1. Map attack surface: identify entry points, trust boundaries, data flows
2. Classify code by risk: authentication, crypto, input handling, state changes
3. Identify external dependencies and their trust levels

### Phase 2: Systematic Analysis
1. **Static analysis**: Run CodeQL/Semgrep with security-focused query packs
2. **Manual review**: Focus on high-risk areas identified in Phase 1
3. **Variant analysis**: Search for similar patterns across the codebase
4. **False positive verification**: Gate each finding with mandatory verification

### Phase 3: Findings Documentation
Write each finding in standard format:

```
## [SEVERITY] Title

**Location**: file:line

**Description**: What the vulnerability is and how it manifests.

**Impact**: What an attacker can achieve by exploiting this.

**Proof of Concept**: Minimal reproduction steps or code.

**Recommendation**: Specific fix guidance with code examples.

**References**: CWE, relevant CVEs, or internal patterns.
```

## Vulnerability Classes

### Smart Contracts
- Reentrancy, access control, flash loan attacks
- Oracle manipulation, MEV exposure
- Integer overflow/underflow, precision loss
- Logic errors in vault/lending/AMM patterns

### Systems Code (C/C++/Rust)
- Memory safety: buffer overflow, use-after-free, double-free
- Integer issues: overflow, truncation, signed/unsigned confusion
- Timing side-channels in cryptographic code
- Insecure deserialization

### Web/API
- Authentication bypass, privilege escalation
- Injection: SQL, NoSQL, command, template, LDAP
- Insecure direct object references (IDOR)
- SSRF, path traversal, file inclusion
- JWT verification bypasses

## Prompt Templates

```prompt
"Audit this smart contract using the Trail of Bits methodology."
"Write a Semgrep rule to detect this vulnerability pattern across the codebase."
"Review this authentication implementation — what would Trail of Bits flag?"
"Generate a CodeQL query to find all instances of this vulnerable pattern."
"Write a security audit finding for this vulnerability in the standard format."
```
