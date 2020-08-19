let UI = function () {

    let tokens,
        syntaxTree,
        plug;

    const selector = {
        input: 'input[name=input]',
        hiddenElement: 'p.form-control',
        output: 'table#output',
        syntaxTree: 'div#syntaxTree',
        sentence: 'div#sentence'
    };

    let showTokens = function (tokens) {

        plug = '';

        tokens.forEach(function (element) {
            plug += '<tr class="row"><td class="column" style="text-align:center;">' + element.value + '</td><td class="column" style="text-align:center;">' + element.type + '</td></tr>';
        });

        document.querySelector(selector.output).innerHTML = plug;
    };

    let showSyntaxTree = function (syntaxTree) {

        json = JSON.stringify(syntaxTree, undefined, 2);

        document.querySelector(selector.syntaxTree).innerHTML = '<pre>' + json + '</pre>';

    };

    let showSentences = function (tokens) {

        plug = '';

        tokens.forEach(function (element) {
            plug += Main.convertOperator(element.value) + ' ';
        });

        document.querySelector(selector.sentence).innerHTML = plug;
    };

    return {

        getSelector: function () {
            return selector;
        },

        listener: function () {

            let hiddenTargets;

            document.querySelector(selector.input).addEventListener('input', function () {

                hiddenTargets = document.querySelectorAll(selector.hiddenElement);

                if (document.querySelector(selector.input).value !== '') {
                    for (let i = 0; i < hiddenTargets.length; i++) {
                        const element = hiddenTargets[i];
                        element.style.display = 'none';
                    }
                    document.querySelector(selector.input).parentNode.classList.add('active');
                } else {
                    hiddenTargets[0].textContent = 'Hasil token akan muncul di sini setelah input diisi';
                    hiddenTargets[1].textContent = 'Kalimat akan muncul di sini setelah input diisi';
                    for (let i = 0; i < hiddenTargets.length; i++) {
                        const element = hiddenTargets[i];
                        element.style.display = 'block';
                    }
                    document.querySelector(selector.input).parentNode.classList.remove('active');
                }

                tokens = Main.getTokens();

                showTokens(tokens);

                showSentences(tokens);

                syntaxTree = Parser.parse(tokens);

                showSyntaxTree(syntaxTree);

            });

        }

    }

}();