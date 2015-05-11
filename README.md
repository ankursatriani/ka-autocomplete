# ka-autocomplete
A simple lightweight autocomplete/typeahead plugin written in vanilla JavaScript. It has no dependencies on any other libraries.

### How to use?

Include the .js and .css files in your HTML and call the **create()** function of **kaAutocomplete** along with the wrapper element and the list of suggestions as arguments. For example, if you want to insert the autocomplete component inside the div with id = 'ka-autocomplete' in the following HTML snippet, add the code in JS snippet to your JavaScript code.

#### HTML snippet

```HTML
<body>
  <div id="ka-autocomplete"></div>
</body>
```

#### JS snippet

```javascript
var kaAutocompleteWrapper = document.getElementById('ka-autocomplete');
var list = ['The Beatles', 'The Doors',	'AC/DC', 'Led Zeppelin']; // replace this with your own list
kaAutocomplete.create(kaAutocompleteWrapper, list);
```

### Browser support

Tested in Firefox, Safari, Chrome, Opera, Internet Explorer 8+.

### License

Please read the LICENSE file.
