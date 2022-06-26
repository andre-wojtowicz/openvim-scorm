function register_VIM_TUTORIAL_SECTIONS(interpreter, messager, createSection, registerSection, showCommandOneByOne, doc) {
  var G = VIM_GENERIC;

  var pressEnterToContinue = "Naciśnij Enter, aby kontynuować.";

  function showInfo(text) { $('.info').text(text); } //.show(); }

  function sendMessageAsync(message) { setTimeout(function() { messager.sendMessage(message); }, 0); }
  
  function requireEnterToContinue() { showCommandOneByOne(["Enter"], accepterCreator); }
  function waitPressToGotoPractice(waitCode, waitKey) {
      messager.sendMessage('waiting_for_code', { 'end': false, 'code': waitCode });
      var forAbortId = messager.listenTo('pressed_key', function (key) {
        console.log("key", key)
          if (key === waitKey) {
              window.location = 'sandbox-pl.html';
              messager.removeListener('pressed_key', forAbortId);
          }
      });
      
      if (API != null)
      {
        var numLevels = $('.section_menu_append_target').children().length;
        var sectionElement = $('.section_menu_item.selected');
        var levelId = sectionElement.index() + 1;
        var sectionTitle = sectionElement.text();
        
        if (!sectionTitle.endsWith(" ✅"))
        {
          sectionElement.text(sectionTitle + " ✅");
        }
        
        ScormSaveAnswer(levelId, numLevels);
      }
  }

  function defaultPre() { interpreter.environment.setInsertMode(); }

  function defaultPost() {
    interpreter.environment.setCommandMode();
    showInfo(pressEnterToContinue);
    requireEnterToContinue();
  }

  /** FIXME: should reuse existing code/key functionality */
  var accepterCreator = function(command) {
    var accepter = function(key) {
      if(command === 'ctrl-v') return key === 22 || ($.browser.mozilla && key === 118); //XXX: ugly and don't even work properly
      if(command === "Esc") return key === 27;
      if(command === "Enter") return key === 13;

      var keyAsCode = G.intToChar(key);
      var neededCode = command;
      
      return keyAsCode === neededCode;
    };

    return accepter;
  };

  function cmd(code, postFun) {
      return {
        'code': code,
        'postFun': postFun
      };
    }

    /** TEMPORARY duplication */
    function writeChar(code) {
      var $ch = $(doc.getChar(code));
      $ch.insertBefore($('.cursor'));
    }

    function insertText(text, newline) {
      var mode = interpreter.environment.getMode();

      interpreter.environment.setInsertMode();
      
      newline = newline !== undefined ? newline : true;

      if(newline) {
        interpreter.interpretSequence(["Esc", "o"]);
      }

      var words = text.split(" ");

      G.for_each(words, function(word) {
        //interpreter.interpretSequence(word);
        G.for_each(word, writeChar);
        interpreter.interpretOneCommand("Space");
      });

      interpreter.environment.setMode(mode);
    }

  var introduction_section = createSection("Wstęp",
        defaultPre,
    [
        "Hejka.",
        "Jestem interaktywnym samouczkiem programu |Vim|.",
        "Bez zbędnych zawiłości nauczę Cię, o co chodzi w Vimie. Jeśli się spieszysz, naciśnij dowolny klawisz, aby przewinąć do przodu.",
        "Aby przećwiczyć to, czego się nauczyłeś, sprawdź stronę |Trening|. Znajdują się na niej informacje o poleceniach z uwzględnieniem kontekstu.",
        "A teraz pozwól, że pokażę Ci podstawy Vima. Kliknij myszką na ten ekran i wciśnij |Enter|."
    ], defaultPost);

    var two_modes_section = createSection("Dwa tryby, INSERT i NORMAL",
        defaultPre,
    [
        "Vim ma dwa podstawowe tryby pracy. Jednym z nich jest tryb |INSERT| (wprowadzanie), w którym pisze się tekst tak, jak w normalnym edytorze tekstu.",
        "Drugi tryb to |NORMAL| (zwykły), który zapewnia efektywne sposoby nawigacji i manipulacji tekstem.",
        "W każdej chwili możesz sprawdzić, w którym trybie jesteś, patrząc na pasek stanu znajdującym ię w górnej części edytora.",
        "Aby przełączać się między trybami, użyj |Esc| dla trybu NORMAL oraz |i| dla trybu INSERT.",
        "Sprawdźmy, jak to działa! Najpierw przejdź do trybu wprowadzania."
    ],
    function() {
        interpreter.environment.setCommandMode();
        showCommandOneByOne(
            [
             cmd("i", function() {
               $('.screen_view').addClass('active_context');
               insertText("Świetnie, teraz jesteś w trybie wprowadzania. Napisz coś i wróć do trybu zwykłego.");
             }),
             cmd("Esc", function() {
               $('.screen_view').removeClass('active_context');
               interpreter.environment.interpretOneCommand("G");
               insertText("Dobrze. Przejdźmy do następnej sekcji.");
             }),
             "Enter"
            ],
            accepterCreator);
    }
    );

    var basic_movement = createSection("Podstawowe ruchy: h, j, k oraz l",
        defaultPre,
    [
        "W przeciwieństwie do zwykłego edytora tekstu, zamiast klawiszy strzałek, do przesuwania kursora używa się klawiszy |h|, |j|, |k| i |l|.",
        "Zobaczmy, jak to działa w praktyce!"
    ], function() {
        interpreter.environment.setCommandMode();
        showCommandOneByOne([
          "h", "h", "h", "k", "l", "l", "h", "h", "j",
          cmd("Enter", function() {
            insertText("Przejdźmy dalej.");
          }), "Enter"],
          accepterCreator);
    });

    var word_movement = createSection("Ruch po wyrazach: w, e, b",
        defaultPre,
      [
        "Aby poruszać się po tekście nie tyle co po poszczególnych znakach, ale po całych wyrazach, można użyć klawiszy |w|, |b| i |e| (oraz W, B, E w prawdziwym Vimie).",
        "|w| przenosi na początek następnego wyrazu; |e| przenosi na koniec wyrazu; a |b| przenosi na początek wyrazu."
      ], function() {
        interpreter.environment.setCommandMode();
        showCommandOneByOne([
          "b", "b", "w", "b", "e", "w",
          cmd("Enter", function() {
            insertText("Uwaga! Idziemy dalej.");
          }), "Enter"],
          accepterCreator);
    });

    var times_movement = createSection("Ruch napędzany liczbą, np. 5w",
      defaultPre,
      [
          "Poruszanie się w tekście nie jest ograniczone do pojedynczych klawiszy; można łączyć klawisze poruszania się z |liczbą|. Na przykład |3w| to to samo, co trzykrotne naciśnięcie klawisza w."
      ],
      function() {
        interpreter.environment.setCommandMode();
        interpreter.interpretSequence("0");
        showCommandOneByOne(["3", "w", "9", "l", "2", "b",
            cmd("Enter", function() { insertText("Z liczbami trzeba się liczyć.") }),
            "Enter"
        ],
        accepterCreator)
      });

    var times_inserting = createSection("Wstaw tekst wielokrotnie, np. 3iTak",
        defaultPre,
        [
            "Tekst można wstawiać wielokrotnie.",
            "Na przykład podkreślenie nagłówka może składać się z 30 |-|.",
            "------------------------------",
            "Dzięki |30i-| |Esc| nie trzeba naciskać klawisza |-| 30 razy.",
            "Wypróbujmy to: wstaw |go| trzy razy."
        ],
        function() {
            interpreter.environment.setCommandMode();
            showCommandOneByOne(
                ["3", "i", "g", "o", "Esc",
                cmdWithText("Enter", "Widzisz? 10iCała praca to tylko zabawaEsc."),
                "Enter"
                ], accepterCreator)
        });

    var find_occurrence = createSection("Znajdź znak, f oraz F",
        defaultPre,
        [
            "Aby znaleźć i przejść do następnego (lub poprzedniego) wystąpienia znaku, użyj |f| i |F|, np. |fo| znajduje następne o.",
            "Można połączyć f z liczbą. Na przykład, możesz znaleźć trzecie wystąpienie 'q' używając |3fq|, que?"
        ],
        function() {
          interpreter.environment.setCommandMode();
          interpreter.interpretSequence("0");
          showCommandOneByOne(["f", "w", "f", "s", "3", "f", "q",
              cmd("Enter", function() { insertText("F-f-f-16!") }),
              "Enter"
          ], accepterCreator)
        });

    var matching_parentheses = createSection("Idź do odpowiadających nawiasów, %",
      defaultPre,
      [
        "W tekście zawierającym nawiasy lub klamry, |(| lub |{| lub |[|, użyj |%|, aby przejść do pasującego nawiasu.",
        "Poniżej znajduje się (przykładowy) tekst do przetestowania."
      ],
      function() {
        interpreter.environment.setCommandMode();
        interpreter.interpretSequence(["F", "("]);
        showCommandOneByOne(["%", "%", "Enter"], accepterCreator)
      });

    var start_and_end_of_line = createSection("Idź na początek/koniec linii, 0 i $",
      defaultPre,
      [
        "Aby przejść na początek linii, naciśnij |0|.",
        "Natomiast by przejść na koniec linii, naciśnij |$|."
      ],
      function() {
        interpreter.environment.setCommandMode();
        showCommandOneByOne(["0", "$", "0", "Enter"], accepterCreator)
      });

    var word_under_cursor = createSection("Znajdź wyraz pod kursorem, * i #",
      defaultPre,
        [
         "Szukamy wyrazu teraz! Znajdź następne wystąpienie wyrazu będącego pod kursorem za pomocą |*|, a poprzednie występienie wyrazu za pomocą |#|."
        ],
        function() {
          interpreter.environment.setCommandMode();
          interpreter.interpretSequence(["0", "w"]);
          showCommandOneByOne(["*", "*", "#",
              cmd("#", function() {
                insertText("Nic nowego pod kursorem.")
              }), "Enter"], accepterCreator)
        });

    var goto_line = createSection("Idź do linii, g oraz G",
        defaultPre,
        [
         "|gg| przenosi użytkownika na początek pliku; |G| na koniec.",
         "Aby przejść bezpośrednio do określonego wiersza, należy podać jego numer wraz z literą |G|.",
         "Teraz przejdź na początek ekranu, wpisując |gg|, a następnie wróć na koniec, wpisując |G|."
        ],
        function() {
          interpreter.environment.setCommandMode();
          showCommandOneByOne(["g", "g", "G",
             cmd("Enter", function() {
                 insertText("Przejdź do linii 2 przy pomocy 2G.");
             }),
             "2", "G",
             cmd("Enter", function() {
                insertText("gg! G naprawdę daje czadu.")
             }), "Enter"
          ], accepterCreator)
        });

    var search_match = createSection("Wyszukaj, /tekst z n oraz N",
      defaultPre,
      [
        "Przeszukiwanie tekstu jest istotną częścią każdego edytora tekstu. W Vimie naciskamy |/| i podajemy szukany tekst.",
        "Wyszukiwanie można powtórzyć dla następnych i poprzednich wystąpień, używając odpowiednio |n| i |N|.",
        "W bardziej wymagających przypadkach możesz użyć wyrażeń regularnych (działają w prawdziwym Vimie), które pomagają znaleźć tekst o określonej postaci.",
        "Spróbujmy przeprowadzić proste wyszukiwanie tekstu.",
        "Wyszukaj |tekst| i znajdź kolejne dopasowania z |n|.",
        "Uwaga! W niektórych przeglądarkach internetowych, gdy wciśniesz |/| włączy się tryb przeszukiwania strony - jeśli taki tryb się włączy, to go zamknij i wróć do tego samouczka."
      ],
      function() {
        interpreter.environment.setCommandMode();
        interpreter.interpretSequence("1G");
        showCommandOneByOne(
          ["/", "t", "e", "k", "s", "t", "Enter", "n", "n", "N", "N",
          cmd("Enter",
            function() {
              interpreter.interpretSequence(["/", "Esc"]);
              insertText("Dziel i rządź przy pomocy /d/z/i/e/l");
            }),
          "Enter"], accepterCreator
        )
      });

    var removing = createSection("Usuń znak, x oraz X",
        defaultPre,
      [
      "|x| i |X| usuwają znak, odpowiednio, pod kursorem i po lewej stronie kursora.",
      "Spróbuj nacisnąć klawisz |x|, aby usunąć ostatnie słowo."
      ], function() {
        interpreter.environment.setCommandMode();
        showCommandOneByOne([
          "x", "x", "x", "x", "x", "x",
          cmd("x", function() {
             insertText("Czasami niewiadoma (x) może zamienić się w prawdziwy skarb.");
          }),
            /*
          "X", "X", "X", "X", "X",
          cmd("X", function() {
            //insertText("You removed yourself from this section. Next!");
          }),
          */
          "Enter"],
          accepterCreator);
    });

    var replacing = createSection("Zastąp literę pod kursorem, r",
        defaultPre,
      [
      "Jeśli chcesz zastąpić tylko jeden znak pod kursorem, bez przechodzenia do trybu wprowadzania, użyj |r|.",
      "Zastąp mniy"
      ], function() {
        interpreter.environment.setCommandMode();
        interpreter.interpretSequence("Fy");
        showCommandOneByOne([
          "r", "e", "Enter"],
          accepterCreator);
    });

    function cmdWithText(command, text) {
        return cmd(command, function() {
                 insertText(text);
               });
    }

    function setActiveContext() { $('.screen_view').addClass('active_context'); }
    function unsetActiveContext() { $('.screen_view').removeClass('active_context'); }

    var adding_line = createSection("Wstaw nową linię, o oraz O",
      defaultPre,
        [
            "Aby wstawić tekst do nowej linii, naciśnij |o| lub |O|.",
            "Po utworzeniu nowej linii, edytor przechodzi w tryb |INSERT|.",
            "Dopisz jakiś fragment tekstu i wróć do trybu |NORMAL|."
        ], function() {
            interpreter.environment.setCommandMode();
            interpreter.interpretSequence(["2", "G"]);
            showCommandOneByOne([
                cmd("o", function() {
                    setActiveContext();
                }),
                cmd("Esc", function() {
                    unsetActiveContext();
                    insertText("Taaak! A teraz duże O by wstawić nową linię nad bieżącą linią.");
                    interpreter.environment.setCommandMode();
                }),
                cmd("O", setActiveContext),
                cmd("Esc",
                    function() {
                        insertText("Założę się, że czujesz się teraz tak: O___o");
                        unsetActiveContext();
                    }), "Enter"
            ], accepterCreator)
        });

    var deleting = createSection("Usuń, d",
        defaultPre,
      [
      "|d| to polecenie usuwania.",
      "Można je połączyć z ruchem, np. |dw| usuwa pierwsze słowo po prawej stronie kursora.",
      "Natomiast w prawdziwym Vimie kopiuje ono również zawartość, dzięki czemu za pomocą |p| można ją wkleić do innej lokalizacji."
      ], function() {
        interpreter.environment.setCommandMode();
        interpreter.environment.interpretOneCommand("0");
        showCommandOneByOne([
          "d", "w",
          cmd("Enter", function() {
            insertText("Słowo zostało usunięte. Teraz usuńmy dwa słowa za pomocą d2e.");
            interpreter.environment.interpretSequence(["0"]);
          }),
          "d", "2", "e",
          cmd("Enter", function() {
            insertText("Niezły z Ciebie ko 'de' r!");
          }), "Enter"],
          accepterCreator);
    });

  var repetition = createSection("Powtórz z .",
    defaultPre,
    [
        "Aby powtórzyć poprzednie polecenie, wystarczy nacisnąć |.|.",
        "Najpierw należy usunąć dwa słowa za pomocą |d2w|.",
        "Następnie usuń pozostałe słowa w tym wierszu za pomocą |.|."
    ],
      function() {
        interpreter.environment.setCommandMode();
        interpreter.interpretOneCommand("0");
        showCommandOneByOne([
            "d", "2",
            "w", ".", ".", ".", ".", ".",
          cmd("Enter", function() {
            insertText("Powtarzanie jest podstawą wszystkich cykli.")
          }),
            "Enter"
        ], accepterCreator)
      });

  var visual_mode = createSection("Tryb wizualny, v",
    defaultPre,
    [
      "Oprócz trybu wprowadzania i trybu normalnego, Vim posiada również tryb |VISUAL| (wizualny).",
      "W trybie wizualnym, najpierw zaznaczasz tekst za pomocą klawiszy ruchu, zanim zdecydujesz co z nim zrobić.",
      "Sprawdźmy, jak to zrobić. Przejdź do trybu wizualnego za pomocą |v|. Następnie zaznacz słowo za pomocą |e|. Po zaznaczeniu tekstu możesz go usunąć, używając klawisza |d|.",
      "To zdanie nie ujrzało światła dziennego."
    ],
    function() {
      interpreter.environment.setCommandMode();
      interpreter.interpretSequence("4b");
      showCommandOneByOne(
        ["v", "e", "l", "d",
          cmdWithText("Enter", "(Po nabyciu umiejętności wizualnych, zabrakło mi słów)."), "Enter"
        ], accepterCreator)
    });

  var visual_block_mode = createSection("Wizualny tryb blokowy, ctrl-v",
    defaultPre,
    [
      "Istnieje jeszcze jeden tryb: |VISUAL BLOCK| (wizualny tryb blokowy). Umożliwia on wprowadzanie tekstu w wielu wierszach jednocześnie. Zobaczmy, jak to zrobić na przykładzie listy.",
      "<> Bystra dziewczyna",
      "<> Ulisses",
      "<> Ucz się i nauczaj",
      "Najpierw przesuń kursor na pozycję wstawiania. Następnie naciśnij |ctrl-v|, aby przejść do trybu bloku wizualnego. Przesuń kursor w pionie, aby zaznaczyć linie. Teraz naciśnij |I| i wstaw tekst do zaznaczonego obszaru. |Esc| kończy wprowadzanie."
    ],
    function() {
      interpreter.environment.setCommandMode();
      interpreter.interpretSequence("2G");
      showCommandOneByOne(["l", "ctrl-v", "j", "j", "I", "o", "Esc",
        cmdWithText("Enter", "Blok-ady nie są przeszkodą na drodze rozwoju."), "Enter"],
        accepterCreator);
    });

  var last_commands = createSection("Prawdziwy Vim czeka",
        defaultPre,
    [
        "Teraz powinieneś móc wejść na pewniaczku do prawdziwego Vima.",
        "Najważniejsze polecenia, które powinieneś zapamiętać, to |:o nazwa_pliku| (otwórz plik), |:w| (zapisz), |:q| (zakończ) i |:q!| (zakończ bez zapisywania).",
        "Ponadto, nie |PANIKUJ!| Jeśli popełnisz błąd, naciśnij |u| aby cofnąć polecenie i |ctrl+R| aby ponowić polecenie.",
        "Jeśli masz jakiś problem lub chcesz dowiedzieć się więcej o możliwościach Vima, wpisz |:help|."
    ],
        defaultPost
    );

  var the_end = createSection("Zakończenie", defaultPre,
      [
        "Dzięki za poświęcony czas. Mam nadzieję, że się podobało.",
        "Naciśnij |space|, jeśli chcesz swobodnie potestować polecenia w edytorze treningowym.",
        "Narka!"
      ], () => waitPressToGotoPractice('Space', 32));

  // append a and A
  // J join lines

  /**********************************************
   * Later
   **********************************************/

  // undo
  // change inside parentheses
  // macro

  /**********************************************
   * Register sections
   **********************************************/

    registerSections([
      introduction_section,
      two_modes_section,
      basic_movement,
      word_movement,
      times_movement,
      times_inserting,
      find_occurrence,
      matching_parentheses,
      start_and_end_of_line,
      word_under_cursor,
      goto_line,
      search_match,
      adding_line,
      removing,
      replacing,
      deleting,
      repetition,
      visual_mode,
      //visual_block_mode, // TODO enable when ctrl-v works with most browsers
      last_commands,
      the_end
    ]);

  function registerSections(sections) {
    G.for_each(sections, function(section) {
      registerSection(section);
    });
  }
}
