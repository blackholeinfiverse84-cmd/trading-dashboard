# Trading Dashboard - Complete User Manual

**Version 1.0**  
**Last Updated:** 2024

---

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Navigation & Layout](#navigation--layout)
4. [Authentication](#authentication)
5. [Dashboard Overview](#dashboard-overview)
6. [Candlestick Chart - Complete Guide](#candlestick-chart---complete-guide)
7. [Buttons & Controls - Detailed Reference](#buttons--controls---detailed-reference)
8. [Input Panel - Trade Configuration](#input-panel---trade-configuration)
9. [Action Panel - Execution Console](#action-panel---execution-console)
10. [Chat Panel - Uniguru AI Assistant](#chat-panel---uniguru-ai-assistant)
11. [Portfolio & Analytics](#portfolio--analytics)
12. [Keyboard Shortcuts](#keyboard-shortcuts)
13. [Troubleshooting](#troubleshooting)

---

## Introduction

Welcome to the Trading Dashboard - a professional-grade platform for real-time market analysis, AI-powered trading insights, and intelligent decision-making. This manual will guide you through every feature, button, and option available in the application.

### What You Can Do

- **Real-time Market Analysis**: View live candlestick charts with multiple time intervals
- **AI-Powered Insights**: Get trading recommendations with confidence scores
- **Multi-Asset Trading**: Trade stocks, cryptocurrencies, and commodities
- **Portfolio Management**: Track equity, P&L, exposure, and leverage
- **Intelligent Assistant**: Chat with Uniguru AI for market education and analysis
- **Risk Management**: Configure stop-loss, target returns, and risk parameters

---

## Getting Started

### First-Time Setup

1. **Create an Account**
   - Click "Register" or "Sign Up" from the landing page
   - Enter username (required, 3-30 characters)
   - Enter email (optional)
   - Create password (minimum 6 characters)
   - Confirm password
   - Click "Sign Up" button

2. **Login**
   - Enter your username and password
   - Click "Sign In" button
   - You'll be redirected to the dashboard

3. **Dashboard Access**
   - After login, you'll see the main trading dashboard
   - All features are accessible from the dashboard

---

## Navigation & Layout

### Main Navigation

The dashboard is organized into several key sections:

#### Header Section
- **Dashboard Title**: "Trading Dashboard" with subtitle
- **Status Indicator**: Shows "Live" status (green dot)
- **User Profile**: Displays your username and avatar
- **Logout Button**: Sign out from your account
- **Theme Toggle**: Switch between dark and light mode

#### Main Content Area
- **Left Column**: Live feed, insights, multi-asset board, market events, chat
- **Right Column (Sidebar)**: Asset allocation, portfolio overview, input panel, action panel

#### Chart Toolbar
- Located at the top of the chart area
- Contains drawing tools and chart controls
- Can be collapsed/expanded

---

## Authentication

### Login Page Buttons

#### "Sign In" Button
- **Location**: Login form, bottom of the card
- **Function**: Submits login credentials
- **States**: 
  - Normal: "Sign In"
  - Loading: "Signing in..." (disabled)
- **Validation**: Requires username and password
- **Action**: Authenticates user and redirects to dashboard

#### "Sign up" Link
- **Location**: Below the Sign In button
- **Function**: Navigates to registration page
- **Style**: Text link (not a button)

### Registration Page Buttons

#### "Sign Up" Button
- **Location**: Registration form, bottom of the card
- **Function**: Creates new user account
- **States**:
  - Normal: "Sign Up"
  - Loading: "Creating account..." (disabled)
- **Validation**: 
  - Username required (3-30 characters)
  - Password required (minimum 6 characters)
  - Passwords must match
- **Action**: Registers user and auto-logs in

#### "Sign in" Link
- **Location**: Below the Sign Up button
- **Function**: Navigates to login page

---

## Dashboard Overview

### Dashboard Header Buttons

#### "Logout" Button
- **Location**: Top-right corner, next to user profile
- **Variant**: Secondary (outlined)
- **Size**: Small
- **Function**: Signs out current user
- **Action**: 
  - Clears authentication
  - Shows success toast
  - Redirects to login page

#### Theme Toggle Button
- **Location**: Top-right corner, next to logout button
- **Variant**: Secondary
- **Size**: Small
- **Icon**: 🌙 (Dark mode) or ☀️ (Light mode)
- **Function**: Switches between dark and light themes
- **Action**: Toggles theme and saves preference to localStorage

---

## Candlestick Chart - Complete Guide

The candlestick chart is the centerpiece of the trading dashboard, providing real-time price visualization with advanced drawing tools.

### Chart Overview

The chart displays:
- **Candlesticks**: Open, High, Low, Close (OHLC) data
- **Price Scale**: Right-side price axis
- **Time Scale**: Bottom time axis
- **Volume**: Optional volume bars
- **Indicators**: Can be added (future feature)

### Chart Controls & Buttons

#### Time Interval Selector Button
- **Location**: Above the chart, left side
- **Appearance**: Dropdown button showing current interval
- **Function**: Opens interval selection menu
- **Available Intervals**:
  - **Ticks**: 1, 10, 100, 1000 ticks
  - **Seconds**: 1, 5, 10, 15, 30, 45 seconds
  - **Minutes**: 1, 2, 3, 5, 10, 15, 30, 45 minutes
  - **Hours**: 1, 2, 3, 4 hours
  - **Days**: 1 day, 1 week, 1 month, 3 months, 6 months, 12 months
  - **Ranges**: 1, 10, 100, 1000 ranges
- **How to Use**:
  1. Click the interval button
  2. Select a category (TICKS, SECONDS, MINUTES, etc.)
  3. Click on desired interval value
  4. Chart updates automatically

#### "Add Custom Interval" Button
- **Location**: Inside interval selector dropdown
- **Function**: Opens custom interval input (placeholder for future feature)
- **Icon**: Plus (+) symbol

#### Category Header Buttons (6 buttons)
- **Location**: Inside interval selector dropdown
- **Categories**: TICKS, SECONDS, MINUTES, HOURS, DAYS, RANGES
- **Function**: Expand/collapse category options
- **Icon**: Caret (► when collapsed, ▼ when expanded)

#### Interval Option Buttons (20+ buttons)
- **Location**: Inside each expanded category
- **Function**: Selects specific time interval
- **Visual**: Highlighted when active
- **Action**: Updates chart timeframe immediately

### Chart Drawing Tools

The chart toolbar provides professional drawing tools for technical analysis.

#### Toolbar Toggle Button
- **Location**: Left edge of chart area
- **Icon**: › (collapsed) or ‹ (expanded)
- **Function**: Shows/hides drawing toolbar
- **Aria Label**: "Expand/Collapse drawing toolbar"

#### Drawing Tool Buttons (7 tools)

1. **Select Tool (Cursor)**
   - **Icon**: Cursor/pointer icon
   - **Function**: Select and move existing drawings
   - **Use Case**: Edit or delete annotations
   - **Keyboard**: Default tool

2. **Trend Line Tool**
   - **Icon**: Diagonal line with circles at ends
   - **Function**: Draw trend lines on chart
   - **How to Use**:
     1. Click tool button
     2. Click start point on chart
     3. Drag to end point
     4. Release to complete
   - **Use Case**: Identify support/resistance levels

3. **Horizontal Line Tool**
   - **Icon**: Horizontal line with arrows
   - **Function**: Draw horizontal price levels
   - **How to Use**:
     1. Click tool button
     2. Click on chart at desired price level
   - **Use Case**: Mark key price levels, stop-loss, targets

4. **Text Note Tool**
   - **Icon**: Text/Typography icon
   - **Function**: Add text annotations
   - **How to Use**:
     1. Click tool button
     2. Click on chart where you want note
     3. Type your annotation
   - **Use Case**: Add trading notes, reminders

5. **Measure Tool**
   - **Icon**: Ruler/measurement icon
   - **Function**: Measure price distance
   - **How to Use**:
     1. Click tool button
     2. Click start point
     3. Drag to end point
   - **Use Case**: Calculate price movements, risk/reward ratios

6. **Delete Tool**
   - **Icon**: Trash can icon
   - **Function**: Remove drawings
   - **How to Use**:
     1. Click tool button
     2. Click on drawing to delete
   - **Use Case**: Clean up chart annotations

7. **Toolbar Toggle** (already covered above)

### Chart Features

#### Asset Search
- **Location**: Above chart, right side
- **Function**: Search for stocks, crypto, commodities
- **Clear Button**: × button to clear search
- **How to Use**:
  1. Type asset symbol or name
  2. Select from dropdown
  3. Chart updates to show selected asset

#### Chart Interactions
- **Zoom**: Scroll wheel or pinch gesture
- **Pan**: Click and drag
- **Crosshair**: Hover to see price/time values
- **Drawing**: Select tool, click and drag on chart

### Chart Data Display

The chart shows:
- **Current Price**: Latest close price
- **Price Change**: Percentage and absolute change
- **Volume**: Trading volume (if available)
- **Time Range**: Visible time period
- **Last Update**: Timestamp of latest data

---

## Buttons & Controls - Detailed Reference

### Public Pages Buttons

#### Landing Page

1. **"Get Started Free" Button**
   - **Location**: Hero section, primary CTA
   - **Variant**: Primary
   - **Size**: Large
   - **Function**: Navigates to registration page
   - **Action**: Opens sign-up form

2. **"Sign In" Button**
   - **Location**: Hero section, secondary CTA
   - **Variant**: Secondary
   - **Size**: Large
   - **Function**: Navigates to login page

3. **"Create Free Account" Button**
   - **Location**: CTA section at bottom
   - **Variant**: Primary
   - **Size**: Large
   - **Function**: Navigates to registration page

#### Public Navigation Bar

1. **"Login" Button**
   - **Location**: Top navigation, right side
   - **Variant**: Ghost (minimal style)
   - **Size**: Small
   - **Function**: Navigates to login page

2. **"Register" Button**
   - **Location**: Top navigation, next to Login
   - **Variant**: Outline
   - **Size**: Small
   - **Function**: Navigates to registration page

3. **"LangGraph Report" Button**
   - **Location**: Top navigation
   - **Variant**: Secondary
   - **Size**: Small
   - **Function**: Opens LangGraph analytics page

4. **"Launch Dashboard" Button**
   - **Location**: Top navigation, rightmost
   - **Variant**: Primary
   - **Size**: Small
   - **Function**: Navigates to dashboard (requires login)

#### About Page

1. **"Sign Up Free" Button**
   - **Location**: Bottom of About page
   - **Variant**: Primary
   - **Function**: Navigates to registration

2. **"Contact Us" Button**
   - **Location**: Next to Sign Up button
   - **Variant**: Secondary
   - **Function**: Navigates to contact page

#### Contact Page

1. **"Send Message" Button**
   - **Location**: Contact form, bottom
   - **Variant**: Primary
   - **Full Width**: Yes
   - **States**:
     - Normal: "Send Message"
     - Loading: "Sending..." (disabled)
   - **Function**: Submits contact form
   - **Validation**: Requires name, email, subject, message

2. **"Create Free Account" Button**
   - **Location**: Bottom of contact page
   - **Variant**: Secondary
   - **Function**: Navigates to registration

### Dashboard Buttons

#### Input Panel Buttons

1. **"Predict + Action Preview" Button**
   - **Location**: Input Panel, bottom left
   - **Variant**: Secondary
   - **Function**: Generates trading decision preview
   - **States**:
     - Normal: "Predict + Action Preview"
     - Loading: "Generating preview..." (disabled)
   - **Requirements**: 
     - Asset selected
     - Stop-loss value
     - Target return value
     - Investment amount
   - **Action**: 
     - Validates inputs
     - Generates mock prediction
     - Shows preview card with:
       - Recommended action (BUY/SELL)
       - Confidence percentage
       - Position size
       - Summary

2. **"Submit Trade Inputs" Button**
   - **Location**: Input Panel, bottom right
   - **Variant**: Primary
   - **Type**: Submit (form submission)
   - **States**:
     - Normal: "Submit Trade Inputs"
     - Loading: "Submitting..." (disabled)
   - **Function**: Saves trade parameters
   - **Action**:
     - Validates all required fields
     - Saves to localStorage
     - Sends risk snapshot to LangGraph
     - Updates Action Panel with decision
     - Shows success toast

#### Horizon Selection Buttons (4 buttons)

- **Location**: Input Panel, Horizon section
- **Type**: Native button elements (chips)
- **Options**: Day, Week, Month, Year
- **Function**: Sets trading time horizon
- **Visual**: Active state highlighted
- **Action**: Updates form data and localStorage

#### Risk Mode Buttons (2 buttons)

1. **"Auto" Risk Mode Button**
   - **Location**: Input Panel, Risk Mode section
   - **Description**: "AI-managed risk parameters"
   - **Function**: Enables automatic risk calculation
   - **Action**: Sets confidence to 85%

2. **"Manual" Risk Mode Button**
   - **Location**: Input Panel, Risk Mode section
   - **Description**: "Trader-defined controls"
   - **Function**: Uses manual risk settings
   - **Action**: Sets confidence to 65%

#### Action Panel Buttons

1. **"Confirm" Button** (per decision)
   - **Location**: Each decision card, footer
   - **Variant**: Primary
   - **Size**: Small
   - **States**:
     - Normal: "Confirm"
     - Loading: "Confirming..." (disabled)
   - **Function**: Confirms trading decision
   - **Action**:
     - Sends confirmation to backend API
     - Marks decision as confirmed
     - Shows success toast
     - Falls back to mock if API fails

2. **"Feedback" Button** (per decision)
   - **Location**: Each decision card, next to Confirm
   - **Variant**: Secondary
   - **Size**: Small
   - **Function**: Opens feedback modal
   - **Action**: Opens modal with:
     - Confidence score slider
     - Notes textarea
     - Cancel and Save buttons

3. **"Cancel" Button** (in feedback modal)
   - **Location**: Feedback modal, footer left
   - **Variant**: Ghost
   - **Function**: Closes feedback modal without saving
   - **Action**: Dismisses modal

4. **"Save Feedback" Button** (in feedback modal)
   - **Location**: Feedback modal, footer right
   - **Variant**: Primary
   - **Function**: Saves feedback to LangGraph
   - **Action**:
     - Saves score and notes
     - Sends to LangGraph client
     - Closes modal
     - Shows success toast

#### Chat Panel Buttons

1. **"Send" Button**
   - **Location**: Chat input area, right side
   - **Variant**: Primary
   - **Type**: Submit
   - **States**:
     - Normal: "Send"
     - Loading: "Sending..." (disabled)
   - **Function**: Sends message to Uniguru AI
   - **Disabled When**: Input is empty or loading
   - **Action**:
     - Adds user message to chat
     - Calls AI API
     - Displays AI response
     - Falls back to mock response if API fails

#### Quick Action Chips (5 buttons)

- **Location**: Chat Panel, top section
- **Type**: Native button elements
- **Function**: Pre-filled prompts for common questions
- **Options**:
  1. "What's the trend on TCS?"
  2. "Compare Reliance vs HDFC."
  3. "Should I buy NIFTY right now?"
  4. "Summarise today's market drivers."
  5. "Teach me about stop-loss strategies."
- **Action**: Fills input field and auto-submits

#### LangGraph Sync Bar Buttons

1. **"Sync mock events" Button**
   - **Location**: LangGraph sync bar, right side
   - **Variant**: Secondary
   - **Size**: Small
   - **Function**: Syncs risk and feedback logs
   - **Action**:
     - Collects all risk snapshots
     - Collects all feedback entries
     - Sends to LangGraph endpoint (mock)
     - Shows status message

#### LangGraph Page Buttons

1. **"Trigger Mock Sync" Button**
   - **Location**: LangGraph page header
   - **Variant**: Secondary
   - **Function**: Manually triggers sync
   - **Action**: Same as sync bar button

2. **"Download JSON" Button**
   - **Location**: LangGraph page header
   - **Variant**: Outline
   - **Function**: Exports logs as JSON file
   - **Action**:
     - Generates JSON with all logs
     - Downloads file: `langgraph-export-[timestamp].json`
     - Includes risk and feedback data

3. **"Clear Logs" Button**
   - **Location**: LangGraph page header
   - **Variant**: Ghost
   - **Function**: Clears all stored logs
   - **Warning**: This action is permanent
   - **Action**:
     - Removes risk log from localStorage
     - Removes feedback log from localStorage
     - Reloads page

#### Scroll to Top Button

- **Location**: Bottom-right corner (floating)
- **Type**: Motion button (appears on scroll)
- **Function**: Scrolls page to top
- **Visibility**: Appears after scrolling 300px down
- **Animation**: Smooth scroll with fade in/out
- **Icon**: Up arrow (^)

#### Toast Close Buttons

- **Location**: Each toast notification, right side
- **Type**: Native button (×)
- **Function**: Dismisses individual toast
- **Aria Label**: "Dismiss notification"
- **Action**: Removes toast from stack

#### Input Spinner Buttons (2 per number input)

1. **Up Arrow Button**
   - **Location**: Number input field, right side (top)
   - **Function**: Increments value by step amount
   - **Icon**: Up arrow (^)
   - **Aria Label**: "Increase value"

2. **Down Arrow Button**
   - **Location**: Number input field, right side (bottom)
   - **Function**: Decrements value by step amount
   - **Icon**: Down arrow (v)
   - **Aria Label**: "Decrease value"

---

## Input Panel - Trade Configuration

### Overview

The Input Panel allows you to configure all trade parameters before submission.

### Form Fields

1. **Asset Search**
   - **Type**: Searchable dropdown
   - **Required**: Yes
   - **Function**: Select stock, crypto, or commodity
   - **Clear Button**: × button to reset selection

2. **Stop-loss (%)**
   - **Type**: Number input
   - **Required**: Yes
   - **Range**: 0-100
   - **Step**: 0.1
   - **Spinner Buttons**: Up/down arrows
   - **Function**: Maximum loss percentage

3. **Target Return (%)**
   - **Type**: Number input
   - **Required**: Yes
   - **Range**: 0-1000
   - **Step**: 0.1
   - **Spinner Buttons**: Up/down arrows
   - **Function**: Expected profit percentage

4. **Investment Amount (₹)**
   - **Type**: Number input
   - **Required**: Yes
   - **Range**: 100 - 10,000,000
   - **Step**: 100
   - **Spinner Buttons**: Up/down arrows
   - **Function**: Capital allocation for trade

5. **Horizon**
   - **Type**: Button chips (4 options)
   - **Options**: Day, Week, Month, Year
   - **Default**: Week
   - **Function**: Trading time horizon

6. **Risk Mode**
   - **Type**: Button cards (2 options)
   - **Options**: Auto, Manual
   - **Default**: Auto
   - **Function**: Risk calculation method

7. **Notes / Rationale**
   - **Type**: Textarea
   - **Required**: No
   - **Rows**: 3
   - **Function**: Trading thesis notes

### Preview Card

After clicking "Predict + Action Preview", a preview card appears showing:
- **Recommended Action**: BUY or SELL
- **Confidence**: Percentage score
- **Position Size**: Investment amount
- **Summary**: AI-generated explanation

---

## Action Panel - Execution Console

### Overview

The Action Panel displays trading decisions from Karan's analysis engine and allows you to confirm or provide feedback.

### Decision Card Components

Each decision shows:
- **Symbol**: Asset ticker
- **Action**: BUY, SELL, HOLD
- **Price**: Entry/exit price
- **Quantity**: Number of shares/units
- **Reason**: Explanation text
- **Confidence**: Percentage with gauge
- **Timestamp**: Time of decision

### Decision States

1. **Pending**: Decision not yet confirmed
   - Shows "Confirm" button
   - Shows "Feedback" button

2. **Confirmed**: Decision has been confirmed
   - Shows "✓ Confirmed" badge
   - May show "(Mock)" indicator if API failed
   - Still allows feedback

### Feedback Modal

Opens when clicking "Feedback" button:

1. **Confidence Score Slider**
   - **Range**: 0-100%
   - **Default**: Decision's confidence
   - **Labels**: Bearish, Neutral, High conviction

2. **Notes Textarea**
   - **Placeholder**: "What stood out? Any risk observations or model adjustments?"
   - **Function**: Free-form feedback text

3. **Action Buttons**:
   - **Cancel**: Closes without saving
   - **Save Feedback**: Saves and sends to LangGraph

---

## Chat Panel - Uniguru AI Assistant

### Overview

Uniguru is your AI trading assistant that can answer questions about markets, trades, risk, and education.

### Features

1. **Quick Action Chips**: 5 pre-filled prompts
2. **Message History**: Scrollable conversation
3. **Rich Responses**: Formatted answers with details
4. **Mock Fallback**: Works even if API is unavailable

### Using the Chat

1. **Type Your Question**: In the textarea at bottom
2. **Press Enter**: Sends message (Shift+Enter for new line)
3. **Click Send Button**: Alternative to Enter key
4. **Use Quick Actions**: Click any chip for instant prompt

### Response Types

- **Simple Text**: Direct answers
- **Rich Format**: Summary with detailed metrics
- **Mock Responses**: Fallback when API unavailable

---

## Portfolio & Analytics

### Portfolio Overview Card

Displays:
- **Total Equity**: Portfolio value
- **Daily P&L**: Profit/loss for today
- **Exposure**: Percentage of capital deployed
- **Cash Buffer**: Available cash percentage
- **Leverage**: Current leverage ratio

### Asset Allocation Card

Shows:
- **Asset Distribution**: Visual breakdown
- **Allocation Percentages**: Per asset type
- **Color Coding**: Different colors per asset

### Insights Panel

Displays:
- **Latest Trade**: Most recent decision
- **Risk Context**: Current risk parameters
- **Market Insights**: Sentiment and analysis

### Feedback Insights

Shows:
- **Average Score**: Mean feedback score
- **Horizon Distribution**: Counts by time horizon
- **Latest Comments**: Recent feedback notes

---

## Keyboard Shortcuts

### Global Shortcuts

1. **Ctrl + K**
   - **Function**: Focus search input
   - **Use**: Quick asset search

2. **Escape**
   - **Function**: Close modals, clear focus
   - **Use**: Dismiss dialogs

3. **Ctrl + /**
   - **Function**: Show keyboard shortcuts help
   - **Use**: Display help toast

4. **Home**
   - **Function**: Scroll to top
   - **Use**: Quick navigation

### Chat Shortcuts

1. **Enter**
   - **Function**: Send message
   - **Use**: Submit chat input

2. **Shift + Enter**
   - **Function**: New line in message
   - **Use**: Multi-line messages

---

## Troubleshooting

### Common Issues

1. **Chart Not Loading**
   - Check internet connection
   - Verify asset symbol is valid
   - Try refreshing page

2. **Buttons Not Responding**
   - Check if button is disabled (grayed out)
   - Verify required fields are filled
   - Check browser console for errors

3. **Login Fails**
   - Verify username and password
   - Check if account exists
   - Try registering new account

4. **Data Not Updating**
   - Check "Live" status indicator
   - Verify backend server is running
   - Check browser console for API errors

5. **Drawings Not Saving**
   - Drawings are session-based
   - Refresh will clear drawings
   - Use screenshots to save annotations

### Button States Explained

- **Normal**: Clickable, ready to use
- **Disabled**: Grayed out, cannot click
  - Reasons: Missing required data, loading, validation failed
- **Loading**: Shows spinner/text, indicates processing
- **Active**: Highlighted, currently selected (for toggles)

### Getting Help

- Use Uniguru chat for questions
- Check browser console (F12) for errors
- Verify all required fields are completed
- Ensure backend server is running (port 5000)

---

## Appendix

### Button Variants

1. **Primary**: Main actions (blue/solid)
2. **Secondary**: Secondary actions (outlined)
3. **Ghost**: Minimal actions (transparent)
4. **Outline**: Bordered actions
5. **Error**: Destructive actions (red)

### Button Sizes

1. **Small (sm)**: Compact buttons
2. **Medium (md)**: Default size
3. **Large (lg)**: Prominent CTAs

### Color Coding

- **Green**: Success, buy actions, positive values
- **Red**: Error, sell actions, negative values
- **Blue**: Primary actions, information
- **Yellow/Orange**: Warnings, caution
- **Gray**: Neutral, disabled states

---

## Quick Reference Card

### Essential Buttons

| Button | Location | Function |
|--------|----------|----------|
| Sign In | Login page | Authenticate |
| Sign Up | Register page | Create account |
| Logout | Dashboard header | Sign out |
| Submit Trade Inputs | Input Panel | Save parameters |
| Confirm | Action Panel | Confirm trade |
| Send | Chat Panel | Send message |
| Theme Toggle | Dashboard header | Switch theme |

### Chart Controls

| Control | Function |
|---------|----------|
| Interval Selector | Change timeframe |
| Select Tool | Edit drawings |
| Trend Line | Draw trend lines |
| Horizontal Line | Mark price levels |
| Text Note | Add annotations |
| Measure | Calculate distances |
| Delete | Remove drawings |

---

**End of User Manual**

For updates and support, visit the About page or use the Contact form.

---

*This manual covers all features as of version 1.0. Features may be added or modified in future updates.*

