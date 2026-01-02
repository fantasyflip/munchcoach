#1
This application is supposed to be a smart grocery list. A user should be able to input ingredients he has access to. The user than has the possibility via a chat button to make the application access a mcp server that has access to a llm and a database of ingredients and recipes. The mcp then returns possible recipes in a chat way similar to chat gpt. The user can interact with the llm via the chat and autmatically add ingredients to the list if they're missing for a recipe.
Since the mcp server is not available yet I need you to create the frontend only. A landing page that attracts visitors to use the application. The landing page should contain a header, a footer, a hero section, a features section and a call to action section. The design should be modern and clean. Use nuxt 3 and tailwindcss for the implementation. For basic components use nuxtwind component library (https://nuxtwind.com/) Make sure the application is responsive and works well on mobile devices. Do not include any backend functionality or mcp server integration. Focus solely on the frontend design and implementation.
Also add a login page with login via discord. Don't implement the auth logic yet, this will be done later. Just create the login page and a button that says "Login with Discord". The button should have the discord logo on it.
Last but not least add the list page with the grocery list. On this page add a floating action button on the bottom right with a symbol that opens the chat interface. The chat interface should be similar to chat gpt design wise.
The overall design should be modern and clean. Use a consistent color scheme and typography throughout the application. Also make use of the @nuxtjs/color-mode module to support dark mode.

#2
The frontend appears modern and well designed. Unfortunately there are a few issues that need to be addressed:

1. The dark mode toggle doesn't change very much in the design. Only some buttons and textfields change the background. The overall design should change more drastically when switching between light and dark mode. Consider changing the background colors of sections, cards, and other elements to better reflect the selected mode.
2. That there's no mcp server yet must not be mentioned. Instead assume there is already a connection. The user is not supposed to add his own mcp. There will be a general mcp server later that the app will connect to. So please remove any mentions of the mcp server from the design and text.
3. The feature section holds many information that the user doesn't care about. The Techstack is not relevant for the user. Instead focus on the benefits for the user. For example: "Save time by getting personalized recipe suggestions based on your available ingredients." or "Reduce food waste by using ingredients you already have at home."
4. All text should be loacalized using nuxt i18n module. Please add localization for english and german. Use appropriate translations for all text in the application.
5. The login link is not accessible on very small screens. Please fix this by adjusting the responsive design.

#3
These are the previos prompts you received for creating the application. It works and feels very well.
Required Changes:

1. Change the application name to MunchCoach. Update all mentions of the name in the codebase.
2. Set the base html color to matching colors for light and dark mode. With the current setup it appears to be white.

#4
Move the login page to the path /auth/login instead of /login

#5
The app has i18n support for english and german already, but there is currently no way to switch the language in the UI. Please add a language switcher in the header that allows the user to switch between english and german. The switcher should be a toggle button since there are only two languages for now. When the user clicks the button, the language should switch and the text in the application should update accordingly. Make sure the switcher is accessible and works well on mobile devices.

#6
The pages are missing meta descriptions for SEO purposes and the tab title. Please add localized meta descriptions and tab titles for all pages. Make sure the descriptions are relevant to the content of each page and include important keywords. The tab title should also reflect the content of the page and include the application name "MunchCoach". Use appropriate translations for both english and german versions.

#7
Improve the callback page to only work on valid callback calls from supabase. Any other call of this page should redirect. If the user is already logged in, redirect to list, if no user is logged in, redirect to login. Handle the logic via a middleware.

#8
Display the users name and profile picture in the navbar when he is logged in. The profile picture should be a small circular image next to the username. If no profile picture is available, display a default avatar icon instead. Make sure the design is responsive and works well on mobile devices. You can leave out the name on very small screens if there is not enough space. For now the display of the name and profile picture serves no other purpose than showing that the user is logged in. When logged in the login button should be replaced by the profile picture and name.

#9
Rework the chat interface component to actually work. Therefore use the installed cerebras api sdk. The Api-Key is available as an environment variable CEREBRAS_API_KEY. The chat interface should have the following functionality:
1. An initial system prompt that tells the llm that it is a smart grocery list assistant. The prompt should be:
"You are MunchCoach, a smart grocery list assistant. Your task is to help users find recipes based on the ingredients they have available. You should suggest recipes, provide cooking instructions, and help users add missing ingredients to their grocery list. Always be friendly and helpful."
2. The frontend should have a static first message from the assistant that welcomes the user and explains how to use the chat:
"Hello! I'm MunchCoach, your smart grocery list assistant. You can tell me what ingredients you have, and I'll suggest recipes for you. If you're missing any ingredients for a recipe, I can help you add them to your grocery list. Just type in your ingredients to get started!"
3. The user should be able to type messages in the chat input and send them to the llm.
4. The messages should be sent to the gemini api using the sdk and the response from the llm should be displayed in the chat interface. The response should be streamed. Cerebras sdk supports streaming: https://inference-docs.cerebras.ai/capabilities/streaming
5. The server route should have a const variable to enable or disable debug logs on the server side. If debug logs are enabled, log the full request and response of the llm to the console. Otherwie just log errors. For now activate debug logs.
6. Static text on the frontend should be localized using the i18n module.
7. Markdown responses should be parsed and displayed as formatted html in the chat interface.

#10
Rework the chat component. It should only be accessible if the user is logged in. If the user is not logged in, redirect to login page. On the login page add a section where the benefits of logged in users are displayed.
Such as "You can save your grocery list and access it from any device." or "You can get personalized recipe suggestions based on your available ingredients." or "You can get personalized recipe suggestions based on your available ingredients." or "Chat with MunchCoach to get personalized recipe suggestions based on your available ingredients.". The text must be localized using the i18n module. If the login is prompted from the chat interface, the login page should be opened with a redirect to the chat interface after login.

#11
Using pinia and the supabase project snimmdlmycfvqgjieuds via the MCP and the exisiting pinia stores create the following functionalities:
1. Define the missing typescript types using the table schema from supabase via the MCP.
2. Create User-Store: Holds the user session and user data.
3. Create Ingredients-Store: It is supposed to manage the access to the supabase ingredients table and provide methods to search for ingredients. Also include the categories of ingredients.
4. After creating the stores rework the list page to hold a pantry and a shopping list. A user only has one pantry list but can have multiple shopping lists. There should be a dropdown to select the shopping list. Add a searchbar component in the apple spotlight style that can be opened via CTRL+K or CMD+K. The searchbar should be an overlay. The searchbar should be able to search for ingredients. It should be able to add an ingredient to the currently selected shopping list. If an ingredient is already in the pantry list, it should be highlighted in the search results.

#12
This looks all very promising. There are just a few issues that need to be addressed:
1. Updating a shopping list item to mark it as bought or unbought refreshes the full list. This results in a full rerender of the list and a bad user experience. Please rework the logic to only update the specific item in the list without refreshing the full list from supabase.
2. Currently it is not possible to add an ingredient via the search to the pantry list. When being in the pantry tab and opening the search the items should be added to the pantry list and not to the shopping list.
3. The in and out transitions of the search and the modal are a little weird. Please rework them to have a smoother transition and don't let them slide in from the left. A simple fade in and fade out would be sufficient.

#13
There are still some issues that need to be addressed and features to be added:
1. The rework of the update of shopping list items didn't work as expected. The update is not reactive. It only updates after a full page refresh. Please fix this.
2. When adding an ingredient to either pantry or shopping list a quantity and unit should be selectable. Please add two input fields in the spotlight search when adding an ingredient. One for quantity (number input) and one for unit (drop down input with items such as g, kg, ml, l, pcs, tbsp, tsp). The default quantity should be 1 and the default unit should be pcs. Quantity and unit should also be visible in the lists.
3. For shopping list entries show if they are in the pantry already. If they are, suggest to check them as bought. If they are in the panty, but missing the required quantity, display the missing quantity with units. For example: "In pantry: 200g, needed: 500g, missing: 300g".
4. Preserve the selected tab and shopping list when refreshing the page via local storage.
5. Make sure that when a user logs out all respective pinia stores are reseted to initial state, and user specific local storage is cleared accordingly.

#14
This looks great! Just a few improvements needed:
1. When a user marks an item as bought, suggest the user to add the item to the pantry, just the same way as it is suggested when an item is already in the pantry.
2. Add unit conversion when validating shopping list items against pantry items. For example, if the user has 1kg of tomatoes in the pantry and needs 500g of tomatoes for the shopping list, it should be recognized that the item is already in the pantry and suggest to mark it as bought. Or when a user has 2kg on his shopping list and 500g in the pantry it should suggest that 1.5kg are still missing. Make sure to cover common units such as g, kg, ml, l, pcs, tbsp, tsp.
3. When a user tries to add an ingredient that is already in the pantry or shopping list, suggest updating the quantity instead of adding a duplicate entry, since this would fail against the database unique constraint.

#15
Further improvements needed:
1. When adding an ingredient that is already in the pantry or shopping list, the spotlight search should show the existing quantity and unit, and inform the user that the new quantity will be added to the existing one. If the user wants to add a quantity of a unit that is not convertible to the existing unit, inform the user that the existing quantity and unit will be overwritten.
2. The preservation of the selected list does not work reliably. When refreshing the page, the selected list is not always preserved.
3. It should not be possible to add ingredients with zero or negative quantity and no unit selected. Validate the input accordingly in the spotlight search.
4. Round quantities to two decimals where displayed. Internally use full precision for calculations.
5. Improve the placement of the button that opens the spotlight search. It should look like an actual search bar. It already kinda looks like one, but it wraps text inside.
6. Improve the placement of the chip that displays the AI-Connection. It should be more subtle and take up less space.
7. Think of a way to add more call to action for the chat interface. Maybe add a button that opens the chat next to the spotlight search button in the header. Or add a small banner below the header that promotes the chat functionality.

#16
Implement the following changes:
1. Whereever a clickable button or element is present, make sure the cursor changes to a pointer on hover to indicate interactivity.
2. Don't close the spotlight search when an item is added. Instead just clear the input fields and keep the search open for adding more items quickly.
3. When a shopping list item is marked as bought and the same item is already in the pantry, suggest updating the pantry quantity.
4. Change the warning when a shopping list item is already in the pantry with a lower quantity than needed to an info message instead of a warning.
5. It is already displayed in the search when an item is in shopping list. Improve this by displaying which shopping list(s) the item is already in. Also add an info to shopping-list-items when the item is also in other shopping lists, including the respective quantities.

#17
Implement the following changes:
1. Make the hint that an item is also in another shopping list clickable. When clicking it it changes the selected shopping list to the respective one.
2. In the pantry add an info for each item that shows in which shopping lists the item is needed, including the respective quantities. Show how much is left over after subtracting the needed quantities from the pantry quantity.

#18
There is an issue with the calculation of remaining quantities in the pantry when an item is needed in multiple shopping lists. Please fix this by correctly summing up the total needed quantity across all shopping lists and subtracting it from the pantry quantity to get the remaining quantity. Make sure to handle unit conversions properly as well as negative remaining quantities.

#19
Add a feature to freeze shopping lists by setting the status to "frozen", so that no items can be added or removed from the list. This is useful when a user has a shopping list for a specific meal which always includes the same items. Items can still be marked as bought, but no new items can be added or removed. Lists can be unfrozen again when needed.

#20
There is a major change required to the list handling:
Looking up the database for project snimmdlmycfvqgjieuds via the MCP you'll find a products table. Each product is linked to an ingredient. For example there are multiple products for the ingredient "ketchup" from different brands. At the moment the product_ingredients connection table is empty. This will be fixed soon, so work with the expected structure. Currently the app only handles ingredients. This needs to be reworked. The shopping_list_items table already got extended by a non mandatory product_id column. I'm thinking of a way where the search still searches for ingredients, but when selecting an ingredient the user can decide if he wants to add a specific product or just the generic ingredient to the list. When selecting an ingredient, similar to quantity and units, a searchable modal should open that displays all products for the selected ingredient. The user can then select one of the products or choose to add the generic ingredient instead. If the user chose a product the shopping_list_item will be set with product_id and ingredient_id. If the user chose the generic ingredient the shopping_list_item will be set with ingredient_id and product_id set to null.
Therefore either create a new pinia store for products or extend the existing ingredients store to also handle products.
Make sure to update all relevant parts of the application to handle products accordingly. For example when displaying the list items, show the product name if a specific product was selected, otherwise show the ingredient name. Also make sure that when checking for existing items in the pantry or shopping list, the check is still done based on the ingredient, not the product.

#21
There are a few adjusments that need to be addressed:
1. The + button for creating a new list should include a localized text that states "Create new list".
2. The search needs to be improved. Best fitting results should be displayed first. For example searching for "sonnenblumenöl" should display "sonnenblumenöl" as the first result. Currently is appears to be random.
3. It needs to be visually more clear for the user where he needs to click to add a new item to the shopping list or pantry.

#22
The database has been extended. The tables ingredients and products now have an extra column called "name_de". Therefore the following tasks need to be addressed:
1. Update the supabase types to include the new column.
2. If the localization is set to german use the "name_de" column instead of the "name" column, if "name_de" holds a value. Otherwise fallback to the "name" column.