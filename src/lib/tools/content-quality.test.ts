import { describe, expect, it } from "vitest";
import type { ToolLocaleContent } from "@/lib/tools/types";
import { validateToolContentQuality } from "../../../scripts/shared/content-quality";

const validContent: ToolLocaleContent = {
  toolId: "sales-tax-calculator",
  locale: "en",
  slug: "sales-tax-calculator",
  h1: "Sales Tax Calculator",
  title: "Sales Tax Calculator",
  shortDescription: "Calculate a tax-inclusive price from a subtotal and tax rate.",
  metaTitle: "Sales Tax Calculator for Totals",
  metaDescription:
    "Calculate sales tax, final price and tax amount for receipts, carts and quick invoice estimates.",
  intro:
    "Enter a pre-tax price and a sales tax rate to see the tax amount and final price before checkout or invoicing.",
  overview:
    "Sales tax changes the price a buyer actually pays, so a quick subtotal is often not enough. This calculator helps you compare a listed price with the final amount after tax, whether you are checking a receipt, preparing a cart total or estimating a small invoice. Use the result as a practical planning number and confirm official rates for regulated accounting work.",
  howItWorks: [
    "Enter the subtotal before tax.",
    "Add the sales tax rate as a percentage.",
    "Review the tax amount and final price."
  ],
  useCases: [
    {
      title: "Checkout planning",
      description:
        "Estimate the final card charge before buying an item where the displayed shelf price excludes tax."
    },
    {
      title: "Receipt review",
      description:
        "Check whether the tax line on a receipt matches the subtotal and the expected local tax rate."
    },
    {
      title: "Small invoice estimates",
      description:
        "Prepare a quick customer-facing estimate before issuing a formal invoice in your accounting system."
    }
  ],
  examples: [
    {
      title: "Retail item with 8.25 percent tax",
      input: "$49.99 at 8.25%",
      output: "$54.11 total",
      description:
        "Shows the tax added to a common retail price before a buyer reaches the payment screen."
    },
    {
      title: "Software subscription estimate",
      input: "$19.00 at 6%",
      output: "$20.14 total",
      description:
        "Useful when a subscription checkout shows tax only after location details are entered."
    },
    {
      title: "Invoice line before billing",
      input: "$250.00 at 7.5%",
      output: "$268.75 total",
      description:
        "Helps prepare a rough total before generating the final taxable invoice in another system."
    }
  ],
  faq: [
    {
      question: "Does this calculate tax from a pre-tax subtotal?",
      answer:
        "Yes. Enter the amount before tax and the percentage rate; the tool returns the added tax and the final total."
    },
    {
      question: "Can I compare several tax rates?",
      answer:
        "Run the calculation again with a different percentage to compare jurisdictions, scenarios or checkout estimates."
    },
    {
      question: "Does it include shipping or fees?",
      answer:
        "Only include shipping or fees if you add them to the subtotal first and they are taxable in your situation."
    },
    {
      question: "Is this a replacement for tax advice?",
      answer:
        "No. It is a calculation helper for estimates; official filings and invoices should follow local tax rules."
    }
  ],
  seo: {
    title: "Sales Tax Calculator",
    description: "Calculate sales tax and final price from a subtotal and rate.",
    keywords: ["sales tax calculator", "calculate sales tax", "tax inclusive price"]
  }
};

describe("content quality validator", () => {
  it("accepts premium tool-specific content", () => {
    expect(validateToolContentQuality(validContent)).toEqual([]);
  });

  it("accepts legacy string use cases when they are descriptive", () => {
    const content = {
      ...validContent,
      useCases: [
        "Estimate the checkout total before buying an item with tax added at payment.",
        "Review whether a receipt tax line matches the expected subtotal and local rate.",
      "Prepare a quick taxable invoice estimate before using the accounting system for final billing."
      ]
    };

    expect(validateToolContentQuality(content)).toEqual([]);
  });

  it("blocks thin-content template phrases and generic examples", () => {
    const content = {
      ...validContent,
      overview:
        "This page is useful for organic traffic and long-tail searches with a fast online answer.",
      examples: [
        {
          title: "Common use case",
          input: "$100 at 8%",
          output: "$108 total",
          description: "Short."
        }
      ],
      faq: [
        {
          question: "How accurate is this tool?",
          answer: "It is accurate."
        }
      ],
      seo: {
        ...validContent.seo,
        keywords: ["sales tax calculator"]
      }
    };

    const messages = validateToolContentQuality(content).map((issue) => issue.message);

    expect(messages).toContain('Forbidden template phrase: "common use case"');
    expect(messages).toContain('Forbidden template phrase: "long-tail"');
    expect(messages).toContain("Example title is generic.");
    expect(messages).toContain("At least 4 tool-specific FAQ items are required.");
    expect(messages).toContain("At least 3 SEO keywords are required.");
  });
});
