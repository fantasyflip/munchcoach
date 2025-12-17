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
Rework the chat interface component to actually work. Therefore use the installed gemini api sdk. The Api-Key is available as an environment variable GEMINI_API_KEY. The chat interface should have the following functionality:
1. An initial system prompt that tells the llm that it is a smart grocery list assistant. The prompt should be:
"You are MunchCoach, a smart grocery list assistant. Your task is to help users find recipes based on the ingredients they have available. You should suggest recipes, provide cooking instructions, and help users add missing ingredients to their grocery list. Always be friendly and helpful."
2. The frontend should have a static first message from the assistant that welcomes the user and explains how to use the chat:
"Hello! I'm MunchCoach, your smart grocery list assistant. You can tell me what ingredients you have, and I'll suggest recipes for you. If you're missing any ingredients for a recipe, I can help you add them to your grocery list. Just type in your ingredients to get started!"
3. The user should be able to type messages in the chat input and send them to the llm.
4. The messages should be sent to the gemini api using the sdk and the response from the llm should be displayed in the chat interface. The response should be streamed. Gemini sdk supports streaming: https://googleapis.github.io/js-genai/release_docs/index.html#streaming
5. The server route should have a const variable to enable or disable debug logs on the server side. If debug logs are enabled, log the full request and response of the llm to the console. Otherwie just log errors.
6. Static text on the frontend should be localized using the i18n module.