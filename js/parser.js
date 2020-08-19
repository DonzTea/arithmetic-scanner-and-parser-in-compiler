let Parser = (function () {
  let buffer = [],
    temp = [],
    exp,
    syntaxTree = {
      name: 'Ekspresi',
      data: '',
    };

  let Expression = function (type, data) {
    this.type = type;
    this.data = data;
  };

  let Addition = function (left, right) {
    this.left = left;
    this.opr = '+';
    this.right = right;
  };

  let Subtraction = function (left, right) {
    this.left = left;
    this.opr = '-';
    this.right = right;
  };

  let Multiplication = function (left, right) {
    this.left = left;
    this.opr = '*';
    this.right = right;
  };

  let Division = function (left, right) {
    this.left = left;
    this.opr = '/';
    this.right = right;
  };

  let Squared = function (left, right) {
    this.left = left;
    this.opr = '^';
    this.right = right;
  };

  let Modulus = function (left, right) {
    this.left = left;
    this.opr = '%';
    this.right = right;
  };

  let syntaxTreeError = function (tokens) {
    exp = new Expression('Error', tokens);
    syntaxTree.data = exp;
  };

  let pushPrefix = function (tokens, opr) {
    let i = 0;
    while (i < tokens.length) {
      // Traverse tokens
      if (tokens.length === 1) {
        // Tokens is only 1 operand
        buffer.unshift(tokens.splice(0, 1)[0]);
        continue;
      } else if (tokens.length === 2) {
        // Tokens element is 2 left
        if (
          tokens[0].type === 'Operator' &&
          (tokens[1].type === 'Angka' || tokens[1].type === 'Variabel')
        ) {
          buffer.unshift(tokens.splice(0, 1)[0]);
          buffer.push(tokens.splice(0, 1)[0]);
          break;
        } else if (
          tokens[1].type === 'Operator' &&
          (tokens[0].type === 'Angka' || tokens[0].type === 'Variabel')
        ) {
          buffer.unshift(tokens.splice(0, 1)[0]);
          buffer.unshift(tokens.splice(0, 1)[0]);
          break;
        } else {
          syntaxTreeError(tokens);
          break;
        }
      } else if (tokens.length > 2) {
        if (tokens[i].type === 'Operator') {
          if (typeof tokens[i - 1] === 'undefined') {
            // undefined operator
            if (
              (tokens[i + 1].type === 'Angka' ||
                tokens[i + 1].type === 'Variabel') &&
              tokens[i + 2].type === 'Operator'
            ) {
              buffer.unshift(tokens.splice(i, 1)[0]);
              buffer.push(tokens.splice(i, 1)[0]);
              continue;
            } else if (
              (tokens[i + 1].type !== 'Angka' ||
                tokens[i + 1].type !== 'Variabel') &&
              tokens[i + 2].type !== 'Operator'
            ) {
              syntaxTreeError(tokens);
              break;
            }
          } else if (tokens[i - 1].type === 'Operator') {
            // Any operator operator
            if (typeof tokens[i + 1] === 'undefined') {
              buffer.unshift(tokens.splice(i, 1)[0]);
            } else {
              if (
                tokens[i + 1].type === 'Angka' ||
                tokens[i + 1].type === 'Variabel'
              ) {
                buffer.push(tokens.splice(i + 1, 1)[0]);
                buffer.unshift(tokens.splice(i, 1)[0]);
              } else {
                buffer.unshift(tokens.splice(i, 1)[0]);
              }
            }
            i--;
            continue;
          }
        }

        if (tokens[i].value === opr) {
          if (typeof tokens[i + 1] === 'undefined') {
            // Operator undefined
            buffer.unshift(tokens.splice(i - 1, 1)[0]);
            buffer.unshift(tokens.splice(i - 1, 1)[0]);
            i -= 2;
            continue;
          } else {
            if (
              (tokens[i + 1].type === 'Angka' ||
                tokens[i + 1].type === 'Variabel') &&
              (tokens[i - 1].type === 'Angka' ||
                tokens[i - 1].type === 'Variabel')
            ) {
              // operand operator operand

              if (typeof tokens[i - 2] === 'undefined') {
                if (typeof tokens[i + 2] === 'undefined') {
                  buffer.unshift(tokens.splice(i + 1, 1)[0]);
                  buffer.unshift(tokens.splice(i - 1, 1)[0]);
                  buffer.unshift(tokens.splice(i - 1, 1)[0]);
                  i = 0;
                  continue;
                } else {
                  if (tokens[i + 2].type === 'Operator') {
                    buffer.unshift(tokens.splice(i + 1, 1)[0]);
                    buffer.unshift(tokens.splice(i - 1, 1)[0]);
                    buffer.unshift(tokens.splice(i - 1, 1)[0]);
                  } else {
                    syntaxTreeError(tokens);
                    break;
                  }
                }
              } else if (typeof tokens[i + 2] === 'undefined') {
                if (tokens[i - 2].type === 'Operator') {
                  buffer.unshift(tokens.splice(i + 1, 1)[0]);
                  buffer.unshift(tokens.splice(i - 1, 1)[0]);
                  buffer.unshift(tokens.splice(i - 1, 1)[0]);
                  i--;
                } else {
                  syntaxTreeError(tokens);
                  break;
                }
              } else {
                buffer.unshift(tokens.splice(i + 1, 1)[0]);
                buffer.unshift(tokens.splice(i - 1, 1)[0]);
                buffer.unshift(tokens.splice(i - 1, 1)[0]);
              }

              i--;
              continue;
            } else if (tokens[i - 1].type === 'Operator') {
              // operator operator operand
              buffer.unshift(tokens.splice(i + 1, 1)[0]);
              buffer.unshift(tokens.splice(i, 1)[0]);
              continue;
            } else if (tokens[i + 1].type === 'Operator') {
              buffer.unshift(tokens.splice(i - 1, 1)[0]);
              buffer.unshift(tokens.splice(i - 1, 1)[0]);
              i--;
              continue;
            } else {
              syntaxTreeError(tokens);
              break;
            }
          }
        }
      }

      i++;
    }
  };

  let createSyntaxTree = function (buffer) {
    let i = buffer.length - 1,
      left,
      right;

    while (i >= 0) {
      if (buffer[i].type === 'Operator') {
        if (typeof buffer[i + 1] === 'undefined') {
          right = temp.splice(temp.length - 1, 1)[0];
          left = temp.splice(temp.length - 1, 1)[0];
          switch (buffer[i].value) {
            case '^':
              temp.unshift(
                new Expression('Perpangkatan', new Squared(left, right)),
              );
              break;
            case '*':
              temp.unshift(
                new Expression('Perkalian', new Multiplication(left, right)),
              );
              break;
            case '/':
              temp.unshift(
                new Expression('Pembagian', new Division(left, right)),
              );
              break;
            case '%':
              temp.unshift(new Expression('Modulus', new Modulus(left, right)));
              break;
            case '+':
              temp.unshift(
                new Expression('Penjumlahan', new Addition(left, right)),
              );
              break;
            case '-':
              temp.unshift(
                new Expression('Pengurangan', new Subtraction(left, right)),
              );
              break;
            default:
              syntaxTreeError(buffer);
              break;
          }
          buffer.splice(i, 1);
        } else if (typeof buffer[i + 2] === 'undefined') {
          if (typeof buffer[i - 1] === 'undefined') {
            left = buffer.splice(i + 1, 1)[0];
            right = temp.splice(temp.length - 1, 1)[0];
          } else {
            if (
              buffer[i - 1].type === 'Angka' ||
              buffer[i - 1].type === 'Variabel'
            ) {
              left = temp.splice(temp.length - 1, 1)[0];
              right = buffer.splice(i + 1, 1)[0];
            } else {
              syntaxTreeError(buffer);
              break;
            }
          }

          switch (buffer[i].value) {
            case '^':
              temp.unshift(
                new Expression('Perpangkatan', new Squared(left, right)),
              );
              break;
            case '*':
              temp.unshift(
                new Expression('Perkalian', new Multiplication(left, right)),
              );
              break;
            case '/':
              temp.unshift(
                new Expression('Pembagian', new Division(left, right)),
              );
              break;
            case '%':
              temp.unshift(new Expression('Modulus', new Modulus(left, right)));
              break;
            case '+':
              temp.unshift(
                new Expression('Penjumlahan', new Addition(left, right)),
              );
              break;
            case '-':
              temp.unshift(
                new Expression('Pengurangan', new Subtraction(left, right)),
              );
              break;
            default:
              syntaxTreeError(buffer);
              break;
          }
          buffer.splice(i, 1);
        } else {
          if (
            (buffer[i + 1].type === 'Angka' ||
              buffer[i + 1].type === 'Variabel') &&
            (buffer[i + 2].type === 'Angka' ||
              buffer[i + 2].type === 'Variabel')
          ) {
            right = buffer.splice(i + 2, 1)[0];
            left = buffer.splice(i + 1, 1)[0];
            switch (buffer[i].value) {
              case '^':
                temp.unshift(
                  new Expression('Perpangkatan', new Squared(left, right)),
                );
                break;
              case '*':
                temp.unshift(
                  new Expression('Perkalian', new Multiplication(left, right)),
                );
                break;
              case '/':
                temp.unshift(
                  new Expression('Pembagian', new Division(left, right)),
                );
                break;
              case '%':
                temp.unshift(
                  new Expression('Modulus', new Modulus(left, right)),
                );
                break;
              case '+':
                temp.unshift(
                  new Expression('Penjumlahan', new Addition(left, right)),
                );
                break;
              case '-':
                temp.unshift(
                  new Expression('Pengurangan', new Subtraction(left, right)),
                );
                break;
              default:
                syntaxTreeError(buffer);
                break;
            }
            buffer.splice(i, 1);
          }
        }
      }

      i--;
    }

    exp = temp.splice(0, 1)[0];
    syntaxTree.data = exp;
  };

  return {
    parse: function (tokens) {
      buffer = [];

      if (tokens.length > 0) {
        // Handle squared
        pushPrefix(tokens, '^');
        // Handle multiplication
        pushPrefix(tokens, '*');
        // Handle division
        pushPrefix(tokens, '/');
        // Handle modulus
        pushPrefix(tokens, '%');
        // Handle Addition
        pushPrefix(tokens, '+');
        // Handle subtraction
        pushPrefix(tokens, '-');
      }

      createSyntaxTree(buffer);

      return syntaxTree;
    },
  };
})();
