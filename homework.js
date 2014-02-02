(function(){
    document.body.addEventListener('click', _onMouseClick, true);

    /**
     * Обработчик клика по ссылке с классом 'popup-link'
     * @param {Event} e событие клика
     * @private
     */
    function _onMouseClick (e) {
        if (e.target.classList.contains('popup-link')) {
			e.preventDefault();
            openPopupFromLink(e.target);
        }
    }

    /**
     * Получает данные из ссылки
     * на основе этих данных создаёт попап или изменяет его содержимое (через createPopup)
     * @param {HTMLElement} link Ссылка с data-аттрибутами
     */
    function openPopupFromLink (link) {
        var href = link.href,
            newCreatePopup;
        function onOk (href) {
            window.location = href;
        }
        newCreatePopup = createPopup(href, onOk);
        openPopupFromLink = function(link) {
            href = link.href;
            newCreatePopup(href);
        }
    }

    /**
     * Создаёт DOM-узел с сообщением и добавляет его в DOM, после возвращает функцию для изменения попапа
     * @param {String} href адрес внешенго ресурса
     * @param {Function} onOk Обработчик клика по кнопке 'Да'
     * @returns {Function} возвращает функцию для изменения динамических данных
     */
    function createPopup (href, onOk) {
        var currentHref = href,
            messageClassName = 'message',
            messageText = 'Вы уверены, что хотите перейти на ',
            openButtonClassName = 'open',
            closeButtonClassName = 'close',
            hideClassName = 'hide',
            popupDomObject = {
                tag : 'div', cls : 'popup-wrap', children : [
                    { tag: 'div', cls : 'popup', children: [
                        { tag: 'div', cls : 'title', text : 'Переход на внешний ресурс' },
                        { tag: 'div', cls : messageClassName },
                        { tag: 'div', cls : 'buttons-wrap', children: [
                            { tag: 'div', cls : openButtonClassName, text : 'Да' },
                            { tag: 'div', cls : closeButtonClassName, text : 'Нет' }
                        ]
                        }
                    ]
                    }
                ]
            },
            popup = createDom (popupDomObject),
            messageNode = createDom.elements[messageClassName][0];
        messageNode.innerHTML = messageText + href;
        createDom.elements[closeButtonClassName][0].addEventListener('click',function(){
            popup.classList.add(hideClassName);
        });
        createDom.elements[openButtonClassName][0].addEventListener('click',function(){
            onOk(currentHref);
        });
        document.body.appendChild(popup);
        return function (href) {
            currentHref = href;
            messageNode.innerHTML = messageText + href;
            popup.classList.remove(hideClassName);
        }
    }

    function createDom (domObject) {
        var element = document.createElement(domObject.tag);
        element.className = domObject.cls;
        if (domObject.text) {
            element.innerHTML = domObject.text;
        }
        if (domObject.children) {
              domObject.children.forEach(function (item) {
                  element.appendChild(createDom(item));
              });
        }
        if (!createDom.elements[domObject.cls]) {
            createDom.elements[domObject.cls] = [];
        }
        createDom.elements[domObject.cls].push(element);
        return element;
    }
    createDom.elements = {};
})();
