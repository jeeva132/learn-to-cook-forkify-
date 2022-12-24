import icons from 'url:../../img/icons.svg'; //for parcel 2

import View from './View.js';

class PaginationView extends View {
  //let currPage;
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      //console.log(btn);
      if (!btn) return;
      const gotoPage = +btn.dataset.goto;
      handler(gotoPage);
    });
  }
  _generateMarkup() {
    const currPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    //console.log(numPages);

    const generateMarkupButton = {
      goToNextPage: `<button data-goto="${
        currPage + 1
      }" class="btn--inline pagination__btn--next">
        <span>Page ${currPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>`,
      goToPrevPage: ` <button data-goto="${
        currPage - 1
      }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
     <span>Page ${currPage - 1}</span>
   </button>`,
    };

    //1.page1,and there are some other pages
    if (currPage === 1 && numPages > 1) {
      //   return `
      //   <button class="btn--inline pagination__btn--next">
      //         <span>Page ${currPage + 1}</span>
      //         <svg class="search__icon">
      //           <use href="${icons}#icon-arrow-right"></use>
      //         </svg>
      //       </button>
      //   `;
      return generateMarkupButton.goToNextPage;
    }

    //3.last page
    if (currPage === numPages && numPages > 1) {
      //   return `
      //      <button class="btn--inline pagination__btn--prev">
      //          <svg class="search__icon">
      //            <use href="${icons}#icon-arrow-left"></use>
      //          </svg>
      //         <span>Page ${currPage - 1}</span>
      //       </button>
      //   `;
      return generateMarkupButton.goToPrevPage;
    }
    //4.other page
    if (currPage < numPages) {
      //   return `
      //   <button class="btn--inline pagination__btn--prev">
      //       <svg class="search__icon">
      //         <use href="${icons}#icon-arrow-left"></use>
      //       </svg>
      //      <span>Page ${currPage - 1}</span>
      //    </button>
      //    <button class="btn--inline pagination__btn--next">
      //         <span>Page ${currPage + 1}</span>
      //         <svg class="search__icon">
      //           <use href="${icons}#icon-arrow-right"></use>
      //         </svg>
      //       </button>

      // `;
      return `${generateMarkupButton.goToPrevPage} ${generateMarkupButton.goToNextPage}`;
    }
    //2.page1,and there are no other pages
    return ``;
  }
}

export default new PaginationView();
