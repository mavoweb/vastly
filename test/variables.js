import jsep from "../node_modules/jsep/dist/jsep.min.js";
import variables from "../src/variables.js";
import serialize from "../src/serialize.js";

export default {
	name: "variables()",
	run (expression) {
		const ast = jsep(expression);
		let identifiers = variables(ast);
		identifiers = identifiers.map(serialize);
		return identifiers;
	},
	tests: [
		{
			args: ["url('tag')"],
			expect: ["url"]
		},
		{
			args: ["!tagFilter || count(tag == tagFilter) > 0"],
			expect: ["tagFilter", "count", "tag", "tagFilter"]
		},
		{
			args: ["if(featured, 'featured')"],
			expect: ["if", "featured"]
		},
		{
			args: ["if(starts(url, 'http'), 'external')"],
			expect: ["if", "starts", "url"]
		},
		{
			args: ["replace(join(pathsummary, ' '), ' ', ' ', 10)"],
			expect: ["replace", "join", "pathsummary"]
		},
		{
			args: ["type == c || type == s || type == q"],
			expect: ["type", "c", "type", "s", "type", "q"]
		},
		{
			args: ["payment * years * 12"],
			expect: ["payment", "years"]
		},
		{
			args: ["amount * interest1200 * (1 + 1 / (pow(1 + interest1200 , years * 12) - 1 ))"],
			expect: ["amount", "interest1200", "pow", "interest1200", "years"]
		},
		{
			args: ["lowercase(get(game.gameTheme, 'name'))"],
			expect: ["lowercase", "get", "game"]
		},
		{
			args: ["pluralize(game.move, 'move', 'moves')"],
			expect: ["pluralize", "game"]
		},
		{
			args: ["random(0, count(themes.theme) - 1)"],
			expect: ["random", "count", "themes"]
		},
		{
			args: ["get(themes.theme, themeNumber)"],
			expect: ["get", "themes", "themeNumber"]
		},
		{
			args: ["if(isShowing, visible)"],
			expect: ["if", "isShowing", "visible"]
		},
		{
			args: ["$today == date && !mode.practiceMode && game.result != lost"],
			expect: ["$today", "date", "mode", "game", "lost"]
		},
		{
			args: ["round(wins / played * 100) || 0"],
			expect: ["round", "wins", "played"]
		},
		{
			args: ["$today == date && !mode.practiceMode"],
			expect: ["$today", "date", "mode"]
		},
		{
			args: ["$today + 1 * day()"],
			expect: ["$today", "day"]
		},
		{
			args: ["digits(2, hours(difference))"],
			expect: ["digits", "hours", "difference"]
		},
		{
			args: ["digits(2, minutes(difference) % 60)"],
			expect: ["digits", "minutes", "difference"]
		},
		{
			args: ["if(value == 0, '--color: initial; --inset: initial;')"],
			expect: ["if", "value"]
		},
		{
			args: ["count(filter(games, guess == guessCount)) || 0"],
			expect: ["count", "filter", "games", "guess", "guessCount"]
		},
		{
			args: ["split(join(guesses), '')"],
			expect: ["split", "join", "guesses"]
		},
		{
			args: ["$user.info.uid"],
			expect: ["$user"]
		},
		{
			args: ["$user.name || $user.info.email"],
			expect: ["$user", "$user"]
		},
		{
			args: ["first(room).name || 'General'"],
			expect: ["first", "room"]
		},
		{
			args: ["user_id && count(messages) == 0"],
			expect: ["user_id", "count", "messages"]
		},
		{
			args: ["(name || '').trim() == ''"],
			expect: ["name"]
		},
		{
			args: ["(done && activeFilter == 'active') || (!done && activeFilter == 'completed')"],
			expect: ["done", "activeFilter", "done", "activeFilter"]
		},
		{
			args: ["if(flexDirection == \"row\" || flexDirection == \"row-reverse\", \"horizontal\", \"vertical\")"],
			expect: ["if", "flexDirection", "flexDirection"]
		},
		{
			args: ["func1(arg1, arg2) + func2(arg3)"],
			expect: ["func1", "arg1", "arg2", "func2", "arg3"]
		},
		{
			args: ["condition ? trueVal : falseVal"],
			expect: ["condition", "trueVal", "falseVal"]
		},
		{
			args: ["(a & b) | (c ^ d)"],
			expect: ["a", "b", "c", "d"]
		},
		{
			args: ["(x && y) || (z || !w)"],
			expect: ["x", "y", "z", "w"]
		},
		// member expressions
		{
			args: ["foo['bar']"],
			expect: ["foo"]
		},
		{
			args: ["foo.bar.baz"],
			expect: ["foo"]
		},
		{
			args: ["foo[bar].baz"],
			expect: ["foo", "bar"]
		},
		{
			args: ["foo[bar.baz]"],
			expect: ["foo", "bar"]
		},
		{
			args: ["foo[bar[baz]]"],
			expect: ["foo", "bar", "baz"],
		},
		{
			args: ["foo['bar'].baz[qux]"],
			expect: ["foo", "qux"]
		}
	]
}