### google gemini pro cli
Google gemini pro cli is a simple tool to generate responses with text-prompts through the terminal using the Google's Gemini Pro language model.

### Usage 

Get an apiKey for gemini-pro -> https://makersuite.google.com/app/apikey

``` bash 
git clone https://github.com/niluk-256/google-gemini-pro-cli.git
cd google-gemini-pro-cli
create a file called .env and add API="Your api key" and save it 
chmod + x main.sh
In .zshrc / .bashrc ,
alias chat='"/home/{ur username}/google-gemini-pro-cli/main.sh"' 
(u can use whatever u like instead of chat )
 source ~/.zshrc
 reload  the terminal
 type ur shortcut key eg: chat  

```