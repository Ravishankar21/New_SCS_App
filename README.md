# Gem Certificate Verification Application

## Overview
A professional web application for verifying gem/stone sustainability certificates through the SCS (SCS Global Services) API. Based on the Excel macro workflow, this application provides a modern, user-friendly interface for bulk stone verification.

## Features

### Input Methods
1. **Manual Entry**: Enter stone IDs one per line in a text area
2. **File Upload**: Upload CSV or Excel files with stone IDs
   - Supports: `.csv`, `.xlsx`, `.xls`
   - Auto-detects header rows
   - Drag & drop interface

### Verification
- Connects to SCS API for real-time verification
- Displays comprehensive gem details:
  - Inventory ID
  - Carat weight, color, clarity, shape
  - Cut, polish, symmetry values
  - Depth and table percentages
  - Certificate URLs and QR codes

### Export Options
- **Excel Export**: Full data table with formatting
- **PDF Export**: Professional report format
- Both include all gem details and certificate links

### User Experience
- Professional corporate design (Swiss minimalist aesthetic)
- Real-time loading states
- Toast notifications for feedback
- Error handling with helpful messages
- Responsive layout

## Technology Stack

### Backend
- **Framework**: FastAPI
- **Database**: MongoDB (for verification history)
- **Libraries**:
  - `httpx` - API requests
  - `openpyxl` - Excel file parsing
  - `xlsxwriter` - Excel export
  - `reportlab` - PDF generation

### Frontend
- **Framework**: React 19
- **UI Components**: Shadcn/UI with Radix UI
- **Styling**: Tailwind CSS
- **Libraries**:
  - `react-dropzone` - File upload
  - `axios` - HTTP requests
  - `sonner` - Toast notifications
  - `lucide-react` - Icons

## API Endpoints

### POST `/api/verify-stones`
Verify multiple stones via SCS API
```json
{
  "stone_ids": ["ST001", "ST002"]
}
```

### POST `/api/upload-file`
Upload CSV/Excel and extract stone IDs
- Returns: Array of stone IDs

### POST `/api/export/excel`
Export verification results to Excel

### POST `/api/export/pdf`
Export verification results to PDF

### GET `/api/history`
Get verification history (last 50 records)

## Usage Instructions

1. **Enter Stone IDs**:
   - Option A: Type stone IDs manually (one per line)
   - Option B: Upload a CSV/Excel file with stone IDs

2. **Verify**:
   - Click "Verify Stones" button
   - Wait for SCS API response

3. **Review Results**:
   - View detailed information in the results table
   - Click certificate links to view full certificates

4. **Export**:
   - Click "Export to Excel" or "Export to PDF"
   - File downloads automatically

## Important Notes

- **Valid Stone IDs Required**: The SCS API only returns data for stones that exist in their database
- **Error Handling**: If stone IDs are not found, you'll see a clear error message
- **API Access**: Uses the SCS public API with embedded access code
- **No Authentication**: Direct access to verification features

## Design Specifications

- **Typography**: 
  - Headings: Cabinet Grotesk
  - Body: IBM Plex Sans
  - Code: JetBrains Mono
- **Colors**:
  - Primary: #0A2540 (dark blue)
  - Accent: #0055FF (blue)
  - Background: #FFFFFF (white)
- **Layout**: Swiss minimalist, high-contrast, data-dense

## Environment Variables

### Backend (.env)
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=test_database
CORS_ORIGINS=*
```

### Frontend (.env)
```
REACT_APP_BACKEND_URL=https://stone-link-gen.preview.emergentagent.com
```

## Future Enhancements

Consider adding:
- Batch processing progress indicators for large files
- Search/filter in results table
- Download certificate PDFs directly from results
- Save favorite stone searches
- Multi-language support
- Advanced filtering by gem properties (carat range, color, clarity, etc.)
