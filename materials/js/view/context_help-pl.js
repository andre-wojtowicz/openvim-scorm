function create_VIM_CONTEXT_HELP(context) {
  var G = VIM_GENERIC;

  function getCommandHelp(keys, description, contexthelp_key) {
    var helpElem = $('<p />', {'class': 'commandhelp'});
    var keyCombination = $('<span />', {'class': 'command_keycombination', 'text': keys});
    var commandDescription = $('<span />', {'class': 'command_description', 'text': description});
    helpElem.append(keyCombination).append(commandDescription);

    if(!!contexthelp_key)
      return helpElem.addClass("helpkey_" + contexthelp_key).addClass('conditional');
		else
      return helpElem;
	}
  
  function addCommandHelp(elem, keys, description, contexthelp_key) {
    getCommandHelp(keys, description, contexthelp_key).appendTo(elem);
  }

  function commandHelp(keys, description, contexthelp_key) {
    var commandMode = $('.command-mode', context);
    addCommandHelp(commandMode, keys, description, contexthelp_key); 
	}

  function addCommandHelps() {
    var insertMode = $('.insert-mode', context);
    
    addCommandHelp(insertMode, "Esc", "zmień na tryb zwykły (NORMAL)");
    commandHelp("i, I", "zmień na tryb wprowadzania (INSERT)");
    commandHelp("h, j, k, l", "przesuń w lewo, w dół, w górę, w prawo");
    commandHelp("w, b, e, ge", "poruszaj się słowo po słowie");
    commandHelp("[n][akcja/ruch]", "wykonaj n razy, np. 3w");
    commandHelp("x, X", "usuń znak");
    commandHelp("a, A", "dopisz");
    commandHelp("f[znak]", "przejdź do następnego podanego znaku w wierszu");
    commandHelp("F[znak]", "przejdź do poprzedniego podanego znaku w wierszu");
    commandHelp("; and ,", "powtórz ostatnie f lub F");
    commandHelp("f[znak]", "przejdź do następnego n-tego podanego znaku w linii", "number_f_char");
    commandHelp("/twojtekst a następnie: n, N", "Wyszukaj tekst");
    commandHelp("d[ruch]", "usuń poprzez poruszanie kursorem");
    commandHelp("r[znak]", "zamień znak pod kursorem");
    commandHelp("0, $", "przejdź do początku/końca linii");
    commandHelp("o, O", "dodaj nową linię");
    commandHelp("%", "przejdź do odpowiadających sobie nawiasów");
//    commandHelp("[( or ])", "Goto next/previous parentheses");
    commandHelp("ci[ruch]", "zmień w obrębie danego ruchu");
    commandHelp("D", "usuń do końca wiersza");
    commandHelp("S", "wyczyść bieżący wiersz; przejdź do trybu wprowadzania");
    commandHelp("g", "przejdź na początek bufora", "g");
    commandHelp("e", "przejdź na koniec poprzedniego słowa", "ge");
    commandHelp("gg / G", "przejdź na początek / koniec bufora");
    commandHelp("G or [liczba]G", "przejdź do linii", "goto_line_g");
    commandHelp("d", "całą linię", "dd");
    commandHelp("$", "pozostałą część linii", "end_of_line");
    commandHelp("0", "od początku linii do tego miejsca", "start_of_line");
    commandHelp("w", "do początku następnego wyrazu", "w");
    commandHelp("e", "do końca bieżącego wyrazu", "e");
    commandHelp("b", "do początku bieżącego wyrazu", "b");
    commandHelp("h, j, k, l", "lefo, dół, góra, prawo", "hjkl");
    commandHelp("[n][ruch]", "porusz się n razy", "num_movement");
    commandHelp("[znak]", "pojedynczy znak", "char");
    commandHelp("[ruch]", "ruch, np. j", "movement");
    commandHelp("yy", "skopiuj bieżącą linię");
    commandHelp("y", "skopiuj bieżącą linię", "copy_line");
    commandHelp("p", "wklej skopiowany tekst za kursorem");
    commandHelp("i[TwojTekst]", "powtórz wprowadzony tekst", "repeat_insert");
    commandHelp("ESC", "anuluj akcję/ruch", "chained"); 
    show_help();
	}

  function set_help(contexthelp_keys, chainedActions) {
    $('.commandhelp', context).hide();
    G.for_each(contexthelp_keys, function(key) {
      $('.commandhelp.helpkey_' + key, context).show();
    });
 
    showChainedActions(chainedActions);   
	}

  function showChainedActions(chainedActions) {
     var result = "";
     G.for_each(chainedActions, function(action) {
       result += action + " ";
    });

    result = $.trim(result); 
    $('.context_pressed', context).text(result);
  } 

  
  function show_help() { 
    $('.context_pressed', context).text('');
    $('.commandhelp', context).show();
    $('.commandhelp.conditional', context).hide();
  }

  return {
    'initialize': addCommandHelps,
    'show_help': show_help,
    'set_help': set_help
  };
}
