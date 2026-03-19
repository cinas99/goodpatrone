---
title: "How to Calculate Days Between Two Dates"
date: "2026-02-20"
category: "time"
description: "Need to know how many days between two dates? Here's how the math works — and why it's trickier than it looks."
---

## The basic idea

Counting days between dates sounds simple: just subtract one date from the other. But calendars are surprisingly complicated — months have different lengths, leap years add an extra day, and the question of whether to include the start or end day changes the answer.

## How the calculation works

The most reliable way to count days between dates is to convert both dates to a common unit — typically milliseconds since a fixed point in time (called a "Unix timestamp") — and then subtract.

In JavaScript (what this site uses):

```js
const a = new Date('2026-01-01');
const b = new Date('2026-03-01');
const days = Math.round((b - a) / (1000 * 60 * 60 * 24));
// Result: 59
```

This automatically handles leap years and different month lengths.

## Inclusive vs exclusive counting

This is where people often disagree:

- **Exclusive** (default): from January 1 to January 3 = **2 days** (Jan 1 and 2 counted, Jan 3 not)
- **Inclusive**: from January 1 to January 3 = **3 days** (all three days counted)

Legal contracts often use inclusive counting ("the notice period is 14 days, starting today"). Travel and event planning usually use exclusive ("I leave on the 1st and return on the 7th, so 6 nights").

## Practical examples

**How long until a deadline?**
If today is March 1st and your deadline is April 15th, you have 45 days. Set a countdown timer for each remaining week to keep yourself on track.

**How old is someone in days?**
Subtract their birth date from today. A 30-year-old has lived approximately 10,950 days — a perspective that makes every day feel a bit more precious.

**How long have you been at a job?**
If you started on June 3, 2021, and today is March 19, 2026, that's 1,750 days — almost 5 years.

**Pregnancy tracking**
A full-term pregnancy is 280 days from the last menstrual period (40 weeks). Most pregnancy apps use day-counting under the hood.

## Leap years

A leap year has 366 days instead of 365. The rule:

- A year is a leap year if it's divisible by 4
- **Except** century years (1900, 2100) — those must be divisible by 400
- So 2000 was a leap year; 1900 was not

This means "1 year" isn't always 365 days. A date calculator accounts for this automatically — which is why tools like the one on this site are more reliable than counting on your fingers.

## Working with weeks and months

When someone asks "how many months between two dates?", it gets fuzzy fast. Is it the number of complete months, or rounded? Does March 1 to April 30 count as 1 month or 2?

The Days Between calculator on Good Patrone shows days, weeks, and months in a clear breakdown — so you can choose the unit that makes sense for your use case.
