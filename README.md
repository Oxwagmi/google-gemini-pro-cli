# simple-ai-cli-tool

Simple-AI-CLI-Tool is a simple CLI program created with free APIs to generate image or text responses from text prompts through the terminal using Google's Gemini Pro language model and Hugging Face's Flux endpoint.

### Usage 

Get an apiKey for gemini-pro -> https://makersuite.google.com/app/apikey
Get huggingface apikey 

``` bash 
git clone the repo
cd google-gemini-pro-cli
npm i 
create a file called .env and add API="Your api key" , HUGFACE="key" and save it  

chmod + x main.sh

In .zshrc / .bashrc ,
alias chat='"/home/{ur username}/simple-ai-cli-tools/main.sh"' 
(u can use whatever u like instead of chat )
 source ~/.zshrc
 reload  the terminal
 type ur shortcut key eg: chat  

```
start with the word imagine to generate images with flux.1 ,default save to images dir.   


https://github.com/user-attachments/assets/76665fc3-70a1-4746-a11c-4556c909d9a3

