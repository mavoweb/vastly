import jsep from "../node_modules/jsep/dist/jsep.min.js";
import extract from "../src/extract.js";
import serialize from "../src/serialize.js";

export default {
	name: "extract()",
	run (expression) {
		const ast = jsep(expression);
        let {variables, functions} = extract(ast);
        variables = variables.map(serialize);
        functions = functions.map(serialize);
		return [variables.toString(), functions.toString()]
	},
	tests: [
		{
			args: ["url('tag')"],
			expect: ["", "url('tag')"]
		},
		{
			args: ["!tagFilter || count(tag == tagFilter) > 0"],
			expect: ["tagFilter,tag,tagFilter", "count(tag == tagFilter)"]
		},
		{
			args: ["if(featured, 'featured')"],
			expect: ["featured", "if(featured, 'featured')"]
		},
		{
			args: ["if(starts(url, 'http'), 'external')"],
			expect: ["url", "if(starts(url, 'http'), 'external'),starts(url, 'http')"]
		},
		{
			args: ["count(done)"],
			expect: ["done", "count(done)"]
		},
		{
			args: ["replace(join(pathsummary, ' '), ' ', ' ', 10)"],
			expect: ["pathsummary", "replace(join(pathsummary, ' '), ' ', ' ', 10),join(pathsummary, ' ')"]
		},
		{
			args: ["type == c || type == s || type == q"],
			expect: ["type,c,type,s,type,q", ""]
		},
		{
			args: ["payment * years * 12"],
			expect: ["payment,years", ""]
		},
		{
			args: ["amount * interest1200 * (1 + 1 / (pow(1 + interest1200 , years * 12) - 1 ))"],
			expect: ["amount,interest1200,interest1200,years", "pow(1 + interest1200, years * 12)"]
		},
		{
			args: ["lowercase(get(game.gameTheme, 'name'))"],
			expect: ["game", "lowercase(get(game.gameTheme, 'name')),get(game.gameTheme, 'name')"]
		},
		{
			args: ["pluralize(game.move, 'move', 'moves')"],
			expect: ["game", "pluralize(game.move, 'move', 'moves')"]
		},
		{
			args: ["random(0, count(themes.theme) - 1)"],
			expect: ["themes", "random(0, count(themes.theme) - 1),count(themes.theme)"]
		},
		{
			args: ["get(themes.theme, themeNumber)"],
			expect: ["themes,themeNumber", "get(themes.theme, themeNumber)"]
		},
		{
			args: ["if(isShowing, visible)"],
			expect: ["isShowing,visible", "if(isShowing, visible)"]
		},
		{
			args: ["$today == date && !mode.practiceMode && game.result != lost"],
			expect: ["$today,date,mode,game,lost", ""]
		},
		{
			args: ["round(wins / played * 100) || 0"],
			expect: ["wins,played", "round(wins / played * 100)"]
		},
		{
			args: ["$today == date && !mode.practiceMode"],
			expect: ["$today,date,mode", ""]
		},
		{
			args: ["$today + 1 * day()"],
			expect: ["$today", "day()"]
		},
		{
			args: ["digits(2, hours(difference))"],
			expect: ["difference", "digits(2, hours(difference)),hours(difference)"]
		},
		{
			args: ["digits(2, minutes(difference) % 60)"],
			expect: ["difference", "digits(2, minutes(difference) % 60),minutes(difference)"]
		},
		{
			args: ["if(value == 0, '--color: initial; --inset: initial;')"],
			expect: ["value", "if(value == 0, '--color: initial; --inset: initial;')"]
		},
		{
			args: ["count(filter(games, guess == guessCount)) || 0"],
			expect: ["games,guess,guessCount", "count(filter(games, guess == guessCount)),filter(games, guess == guessCount)"]
		},
		{
			args: ["split(join(guesses), '')"],
			expect: ["guesses", "split(join(guesses), ''),join(guesses)"]
		},
		{
			args: ["$user.info.uid"],
			expect: ["$user", ""]
		},
		{
			args: ["$user.name || $user.info.email"],
			expect: ["$user,$user", ""]
		},
		{
			args: ["first(room).name || 'General'"],
			expect: ["room", "first(room)"]
		},
		{
			args: ["user_id && count(messages) == 0"],
			expect: ["user_id,messages", "count(messages)"]
		},
		{
			args: ["(name || '').trim() == ''"],
			expect: ["name", "name || ''.trim()"]
		},
		{
			args: ["(done && activeFilter == 'active') || (!done && activeFilter == 'completed')"],
			expect: ["done,activeFilter,done,activeFilter", ""]
		},
		{
			args: ["(numOfChildren % 5) + 1"],
			expect: ["numOfChildren", ""]
		},
		{
			args: ["if(flexDirection == \"row\" || flexDirection == \"row-reverse\", \"horizontal\", \"vertical\")"],
			expect: ["flexDirection,flexDirection", "if(flexDirection == \"row\" || flexDirection == \"row-reverse\", \"horizontal\", \"vertical\")"]
		},
		{
			args: ["numOfChildren > 6 && (flexDirection == 'row' || flexDirection == 'row-reverse')"],
			expect: ["numOfChildren,flexDirection,flexDirection", ""]
		},
		{
			args: ["(flexWrap == 'wrap' || flexWrap == 'wrap-reverse') && (isMoreThanOneRow || isMoreThanOneColumn)"],
			expect: ["flexWrap,flexWrap,isMoreThanOneRow,isMoreThanOneColumn", ""]
		},
	]
}