The script is used to automatically download sprites from [spriters-resource.com](http://spriters-resource.com)
website.

In order to use it - type something like in your console (of course, you will have to have node.js installed first!)

    npm install -g spriters-resource
    
..and then everywhere type
    
    spriters --get "/pc_computer/heroesofmightandmagic2/"
    
where /pc_computer/heroesofmightandmagic2/ is an url (or a part of url) of a game page on spriters-resource website.
All the sprites available for that url (if any) will be downloaded and saved into current working directory.

You can also search for the url using following command:

    spriters --search "Heroes Of Might And Magic"
    
where Heroes Of Might And Magic is a game name. The search results (name - partial URL) will be outputted in console
(if any)
  