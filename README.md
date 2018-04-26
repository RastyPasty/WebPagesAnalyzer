# WebPagesAnalyzer

Task:
1. Create a .Net web application and host it as a Cloud project on Azure.
2. The project should have a single page with a form where I can enter a URL to any website (e.g. Wikipedia or BBC News)
3. The application should fetch that url and build a dictionary that contains the frequency of use of each word on that page.
4. Each time a URL is fetched, it should save the top 100 words to an Azure SQL (PaaS) database , with the following three columns:
    a. The primary key for the word is a salted hash of the word.
    b. The word itself is saved in a column that has encryption, and you are saving the encrypted version of the word.
    c. The total frequency count of the word.
5. Each time a new URL is fetched, you should INSERT or UPDATE the word rows.
6. On an “admin” page (which you don’t need to deal with user/role management, just a link to admin area somewhere), that will list all words entered into the DB, ordered by frequency of usage, visible in decrypted form.
 
Extra points for:
1. In README, describe the best way to safely store and manage the keys.
2. Elegant front end layout.
3. Clean, SOLID, well-tested and well-documented code.
