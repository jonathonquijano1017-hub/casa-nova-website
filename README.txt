CASA NOVA WEBSITE — PREMIUM SHORT UPDATE

What changed:
- Homepage reduced to three main sections:
  1. Full-screen hero
  2. Three service packages
  3. Why Casa Nova + quote button
- Removed extra homepage content and long scrolling sections
- Kept only one main hero image
- Quote page remains separate
- Number 1 “Choose a package” supports both selecting and deselecting:
  tap once to select, tap the selected package again to remove it
- Homepage package cards open quote.html with that package preselected
- English / Spanish support remains
- Estimated total, add-ons, baskets, and text request remain

Upload these files to the ROOT of the existing GitHub repository:
- index.html
- quote.html
- styles.css
- script.js
- hero.jpg

Replace files with the same names.


NEW UPDATE:
- Package cards now reliably select and deselect on iPhone and desktop.
- Added a None button for package selection.
- Added a None button for Laundry and Add-ons.
- None clears every add-on.
- Selecting any add-on automatically turns off None.
- If no add-ons are selected, None becomes active again.
- Added itemized estimated pricing:
  Package
  Extra laundry
  Add-ons
  Total


FIX UPDATE:
- Fixed package selection on mobile and desktop.
- Tap once to select a package.
- Tap the selected package again to deselect it.
- Fixed all estimate calculations.
- Package, extra laundry, add-ons, and total now update immediately.
- Cleaned the blue estimate box so yellow amounts align correctly beside each label.


FORCE REFRESH FIX:
- Replaced radio/label package controls with true buttons.
- Package selection now works reliably on iPhone.
- Tap once to select and tap again to deselect.
- Added version numbers to CSS and JavaScript links to bypass browser cache.
- Estimate updates immediately for package, extra laundry, add-ons, and total.


SERVICE FREQUENCY UPDATE:
- Added One-Time, Weekly, Every 2 Weeks, and Monthly options.
- Weekly subtracts $10 from each estimated visit.
- Every 2 Weeks subtracts $5 from each estimated visit.
- One-Time and Monthly have no discount.
- The itemized estimate now displays the recurring discount.
- Frequency and discount are included in the quote text message.
- Recurring discounts begin after the first completed service.
