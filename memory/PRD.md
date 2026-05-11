# PRD: Gem Certificate Verification Application

## Original Problem Statement
Build an application based on an attached Excel macro (getSCSReport). Users should be able to enter multiple stone IDs and get certificate links. The macro calls the SCS sustainability API to verify gems and return certificate URLs.

## Architecture
- **Backend**: FastAPI (Python) with httpx for async SCS API calls
- **Frontend**: React 19 with Tailwind CSS, Shadcn/UI components
- **Database**: MongoDB (verification history)
- **External API**: SCS SustRated Gems Verify API

## What's Been Implemented (2026-04-15)
- Manual stone ID input (textarea, one per line)
- CSV/Excel file upload with auto-detection of stone ID columns
- SCS API integration for real-time gem verification
- Results table with full gem details (carat, color, clarity, shape, cut, polish, symmetry, sustainability status)
- Certificate URL links (View) for each verified stone
- Export to Excel and PDF
- Verification history stored in MongoDB
- Bug fix: GemData model updated to handle bool/mixed types from SCS API

## Prioritized Backlog
- P1: Batch progress indicators for large file uploads
- P1: Search/filter in results table
- P2: Download certificate PDFs directly from results
- P2: History page to view past verifications
- P3: Multi-language support
