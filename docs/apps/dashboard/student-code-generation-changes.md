# Student Code Generation Changes

## Summary

Modified the student drawer component to provide manual code generation options instead of automatic generation.

## Changes Made

### 1. Removed Automatic Code Generation

- Removed the `useEffect` that automatically generated codes when typing student names
- Code field now starts empty and requires manual action

### 2. Added Manual Code Generation Buttons

The code field now has three action buttons (only visible in add mode):

#### Random Code Generation (🎲 Dice Icon)

- Generates a random 6-character alphanumeric code
- Format: Uses uppercase letters and numbers (e.g., "A3B9X7")
- Always available in add mode

#### Name-Based Code Generation (🔤 Type Icon)

- Generates code based on student initials + sequential number
- Format: Uses first letters of names + 3-digit number (e.g., "AH001")
- Only enabled when student name is entered
- Ensures uniqueness by checking existing codes

#### Reset Code (↻ Reset Icon)

- Resets the code field to empty state
- Only enabled when code has been modified

### 3. UI Improvements

- Added tooltips to all buttons for better user experience
- Buttons are properly disabled when not applicable
- Maintains existing accessibility and styling

## Usage Flow

1. User enters student name
2. User can choose to:
   - Generate random code using dice button
   - Generate name-based code using type button
   - Enter custom code manually
3. User can reset if needed using reset button

## Technical Details

- Functions: `generateRandomCode()`, `generateCodeFromName()`
- Icons: Added `Dice3` and `Type` from lucide-react
- Maintains existing validation and error handling
- Code field remains disabled in edit mode (as per previous requirements)

