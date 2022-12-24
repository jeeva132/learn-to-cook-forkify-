import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    //0)results view to mark selected search results
    resultsView.update(model.getSearchResultsPage());

    //1) loading recipe
    await model.loadRecipe(id);

    //2)rendering recipe

    recipeView.render(model.state.recipe);

    //3)updating bookmarks view
    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    //alert(err);
    //console.error(`${err.message}:${err.stack}`);
    recipeView.renderError();
    console.error(err);
  }
};
//controlRecipe();

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //1)to get search query
    const query = searchView.getQuery();
    if (!query) return;

    //2)to load search results
    await model.loadSearchResults(query);

    //3)render results
    //resultsView.render(model.state.search.results);

    resultsView.render(model.getSearchResultsPage());

    //4) render intitial pagination buttons

    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
//controlSearchResults();

const controPagination = function (gotoPage) {
  //1) render new results
  resultsView.render(model.getSearchResultsPage(gotoPage));

  //4) render new pagination buttons

  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //update the recipe servings (in state)
  model.updateServings(newServings);
  //update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //1) add or remove book mark
  if (!model.state.recipe.bookmarks) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //2)update recipe view

  recipeView.update(model.state.recipe);
  //3) render bookmark
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //show loading spinner
    addRecipeView.renderSpinner();

    //upload the new recipe
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //render recipe
    recipeView.render(model.state.recipe);

    //success message
    addRecipeView.renderMessage();

    //render bookmarks view
    bookmarksView.render(model.state.bookmarks);

    //change id in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💣', err);
    addRecipeView.renderError(err.message);
  }
};

const newFeature = function () {
  console.log('welcome to the application');
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBoookmark(controlAddBookmark);
  searchView.addHandlerFunction(controlSearchResults);
  paginationView.addHandlerClick(controPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  newFeature();
};
init();
