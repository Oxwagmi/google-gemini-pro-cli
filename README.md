# google-gemini-pro-cli

Google gemini pro cli is a simple tool to generate responses with text-prompts through the terminal using the Google's Gemini Pro language model.

---

https://github.com/niluke/google-gemini-pro-cli/assets/67406138/604cfbcc-5916-429f-b7c7-b4bce7811961

---

### Usage 

Get an apiKey for gemini-pro -> https://makersuite.google.com/app/apikey
Get huggingface apikey 

``` bash 
git clone https://github.com/niluke/google-gemini-pro-cli.git
cd google-gemini-pro-cli
npm i 
create a file called .env and add API="Your api key" , HUGFACE="key" and save it  

chmod + x main.sh

In .zshrc / .bashrc ,
alias chat='"/home/{ur username}/google-gemini-pro-cli/main.sh"' 
(u can use whatever u like instead of chat )
 source ~/.zshrc
 reload  the terminal
 type ur shortcut key eg: chat  

```
start with the word imagine to generate images with flux.1 ,default save to images dir.   