const itemForm = document.querySelector("#item-form");
const itemInput = document.querySelector("#item-input");
const List = document.querySelector('#item-list');
const itemClear = document.querySelector('#clear');
const clearButton = document.querySelector('#clear');
const filterButton = document.querySelector('#filter')
const formButton = itemForm.querySelector('button');
let isEditMode = false;


function reloadItemsFromStorage(){
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach(item => addItemToDOM(item));

    checkUI();
}

function onAddItemSubmit(e) {
    e.preventDefault();
    const newItem = itemInput.value;
    const itemToEdit = document.querySelector('.edit-mode');

    //validation
    if (newItem === '') {
        alert('please add an item');
        return;
    }

    if(isItemExists(newItem)){
        alert("Item already exists!");
        itemToEdit.classList.remove('edit-mode');
        checkUI();
        return;
    }

    if(isEditMode){

        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
    }
        

    //creating and adding items to the DOM
    addItemToDOM(newItem);

    //adding to the session storage in the browser
    addItemToStorage(newItem);

    //clearing the input
    itemInput.value = '';

    checkUI();
}

function addItemToDOM(item){
    // creating a list item
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));

    //creating button
    const button = document.createElement('button');
    button.className = "remove-item btn-link text-red";
    const iTag = document.createElement('i');
    iTag.className = "fa-solid fa-xmark";
    button.appendChild(iTag);

    //appending button to li
    li.appendChild(button);

    //li to body
    List.appendChild(li);

}

function addItemToStorage(item){
    const itemsFromStorage = getItemsFromStorage();
    

    itemsFromStorage.push(item);
    //now convert to string and set to session storage
    sessionStorage.setItem('items',JSON.stringify(itemsFromStorage));
}


function getItemsFromStorage (){
    
    let itemsFromStorage;//this will be the array
    
    //if sessionStorage is empty then make itemFromStorage empty
    if(sessionStorage.getItem('items') === null){
        itemsFromStorage = [];
    }else{
        //else, get the array(in the from of a string) from sessionStorage then parse it into an array
        itemsFromStorage = JSON.parse(sessionStorage.getItem('items'));
    }
    
    return itemsFromStorage;
}

function onClickItem(e){
    if (e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement);
    }else{
        setItemToEdit(e.target);
    }
}

function isItemExists(item){
    const itemsFromStorage = getItemsFromStorage();

    return itemsFromStorage.includes(item);
}

function setItemToEdit(item){
    isEditMode = true;

    //removing edit-mode class from all items
    List.querySelectorAll('li').forEach(i => i.classList.remove('edit-mode'));

    //changing class of item, this will change it's color
    item.classList.add('edit-mode');

    //changing the button to "update Item"
    formButton.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
    formButton.style.backgroundColor = '#6496ED';

    itemInput.value = item.textContent;
}

function removeItem(item) {
    //remove item from DOM
    item.remove();
    
    //remove item from sessionStorage
    removeItemFromStorage(item.textContent);
    
    checkUI();
}

//this will remove items from session Storage
function removeItemFromStorage(item){
    //getting items that are already in storage
    let itemsFromStorage = getItemsFromStorage();

    //removing the desired item from array 
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

    sessionStorage.setItem('items',JSON.stringify(itemsFromStorage));

    // sessionStorage.clear();

    // itemsFromStorage.forEach((item)=>{
    //     addItemToStorage(item);
    // });
}

//clear all function
function clearItems(e) {
    //asks for confirmation before deleting
    if (confirm('Are you sure? this will delete all items in the list.')) {
        while (List.firstChild) {
            List.firstChild.remove();
        }
    }

    sessionStorage.removeItem('items');

    checkUI();
}


//filter
function filterItems(e) {
    //list of all items in a nodeCollection
    const items = document.querySelectorAll('li');
    //text from filter input
    const text = e.target.value.toLowerCase();

    items.forEach(item => {
        const itemName = item.firstChild.textContent.toLowerCase();
        if(itemName.indexOf(text) != -1){
            item.style.display = 'flex';
        }else{
            item.style.display = 'none';
        }
    });
}

//hiding and showing clearAll and filter buttons
function checkUI() {
    itemInput.value = '';
    const items = document.querySelectorAll('li');

    //if item list is empty
    if (items.length === 0) {
        clearButton.style.display = 'none';
        filterButton.style.display = 'none'
    } else { // if item list is not empty

        clearButton.style.display = 'block';
        filterButton.style.display = 'block'
    }

    formButton.innerHTML = '<i class="fa-solid fa-plus"></i> Submit ';
    formButton.style.backgroundColor = '#333';
    isEditMode = false;
}

//Initializing function
function init(){
    //event listeners
    itemForm.addEventListener('submit', onAddItemSubmit);
    List.addEventListener('click', onClickItem);
    itemClear.addEventListener('click', clearItems);
    filterButton.addEventListener('input', filterItems);
    document.addEventListener('DOMContentLoaded', reloadItemsFromStorage);
    
    checkUI();
    
}

init();