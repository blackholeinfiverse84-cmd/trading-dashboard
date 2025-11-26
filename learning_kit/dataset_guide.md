# Finance Education Dataset Guide

This repo seeds a 200-entry conversational dataset for training Uniguru on education and trading jargon. Use this guide to extend or audit the content.

---

## 1. Directory Structure

```
dataset/finance_edu/
├── education/
│   └── education_dataset.json
└── trading_jargon/
    └── trading_jargon_dataset.json
```

- **education**: foundational concepts—risk management, derivatives, macro, portfolio theory.
- **trading_jargon**: colloquial phrases and slang used by retail + pro desks.

---

## 2. Record Schema

Each JSON array entry follows the same shape:

```json
{
  "question": "Plain-language query",
  "answer": "Concise paragraph (1–3 sentences)",
  "context": "topic_slug",
  "difficulty": "basic|intermediate|advanced"
}
```

### Context Tags
Use descriptive slugs so downstream filters can build topic-specific prompts. Examples already present:
- `risk_management`, `portfolio_management`, `derivatives`, `technical_analysis`
- `macro_strategy`, `market_structure`, `trading_psychology`, `fundamental_analysis`
- `trading_jargon`, `order_flow`, `commodities`, `fixed_income`, etc.

### Difficulty Levels
- **basic** – definitions that a new investor should grasp quickly.
- **intermediate** – assumes working knowledge of markets.
- **advanced** – quant, derivatives, or institutional concepts.

---

## 3. Contribution Workflow

1. **Pick the subset** (education vs. jargon). Keep files under 1,000 entries for readability.
2. **Add entries** to the JSON array. Maintain valid JSON (no trailing commas). Tip: use a formatter (Prettier or ESLint).
3. **Lint/Validate**:
   ```bash
   jq '.' dataset/finance_edu/education/education_dataset.json
   jq '.' dataset/finance_edu/trading_jargon/trading_jargon_dataset.json
   ```
4. **Context Consistency**: reuse existing context tags. If adding a new tag, document it in this guide.
5. **Review** for duplication, tone (neutral, educational), and bias (ensure global relevance).

---

## 4. Sourcing & Inspiration

- **Education subset**: textbooks (Hull, Bodie), CFA notes, BIS/IMF primers, reputable blogs (Investopedia, CME, Bank research).
- **Jargon subset**: Bloomberg articles, Zerodha Varsity, institutional desk slang, crypto lexicons.
- Always rewrite in your own words to avoid licensing issues.

---

## 5. Extending the Dataset

| Task | Suggested Approach |
|------|--------------------|
| Add regional instruments | Introduce contexts like `india_equities`, `forex`, `emerging_markets`. |
| Multi-lingual support | Duplicate entries with translated question/answer + `language` field. |
| Conversation turns | Wrap multiple QA pairs into scenarios for fine-tuning chat agents. |
| Metadata | Add optional fields (`source`, `last_reviewed`) if provenance tracking is needed. |

---

## 6. Quality Checklist

- ✔ Clear single-question prompts.
- ✔ Answers under ~60 words; break longer explanations into separate entries.
- ✔ Context + difficulty populated.
- ✔ JSON validated.
- ✔ No personal data, no copyrighted text.

Following this process keeps the dataset consistent and production-safe for future LLM fine-tuning.***

