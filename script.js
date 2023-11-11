

//Making and setting the classes of characters
function set_char_class(c, name) { c.className = name;};
function get_char_class(c, name) { return c.className;};

function make_char(s) {
    let node = document.createElement("span");
    if (s == " ")
        node.innerHTML = "&nbsp;";
    else if (s == "\n")
        node = document.createElement("br");
    else
        node.innerHTML = s;
    return node;
};

//Functions for interacting with divisions
function append_char(div, c) {div.appendChild(c);};
function first_char(div) {return div.firstChild; };
function insert_before(div, c, next) {div.insertBefore(c, next) ;};
function delete_char(c) {c.remove(); } ;

function replace_char(div, c, new_char) 
{
	if(next_char(c) == null) {
		c.remove();
		div.appendChild(new_char);
	} else {
		let next = next_char(c);
		c.remove();
		insert_before(div, new_char, next)
	}
}



//function for moving to the next and previous characters
function next_char(c) {return c == null ? null : c.nextElementSibling; };
function prev_char(c) {return c == null ? null : c.previousElementSibling; };
	
function next_line(c) 
{
	while(c != null && !is_newline(c))
		c = next_char(c);
	if(c != null)
		c = next_char(c);
	return c;
}

function prev_line(c)
{
	if(c != null)
		c = prev_char(c);
	while(c != null && !is_newline(c))
		c = prev_char(c);
	while(c != null && prev_char(c) != null && !is_newline(prev_char(c)))
		c = prev_char(c);
	return c;
}

function set_line_visibility(c, visible)
{
	display = visible ? "inline" : "none";

	while(c != null && !is_newline(c)) {
		c.style.display = display;
		c = next_char(c);
	}
	if(c != null)
		c.style.display = display;
}




function char_to_index(div, c) {
	let a = first_char(div);

	let i;
	for(i = 0; a != c; i++) {
		if (a == null)
			return null
		else 
			a = next_char(a);
	}

	return i;
}

function index_to_char(div, i) {
	let a = first_char(div);
	
	while(i > 0) {
		a = next_char(a);
		i--;
	}

	return a;
}


function is_newline(c) { return c.nodeName == "BR"; };
function is_space(c) { return c.innerHTML == "&nbsp;"};
function is_whitespace(c) {return c == null || is_newline(c) || is_space(c) ;};
function char_has_value(c, s) {return c.innerHTML == s; };
function hide_char(c) {c.style.display = "none"; };
function show_char(c) {c.style.display = "inline"; };

function beg_of_word(c) {return  is_whitespace(prev_char(c)) && !is_whitespace(c) ;};
function end_of_word(c) {return !is_whitespace(prev_char(c)) &&  is_whitespace(c) ;};
function mid_of_word(c) {return !is_whitespace(prev_char(c)) && !is_whitespace(c) ;};

function word_wrap(div, start, end, cols)
{
	let c = start;
	while(true) {
		let last_space = null;
		for(let i = 0; i < cols; i++) {
			if(c == end)
				return;
			if(is_newline(c)) {
				let space = make_char(' ');
				replace_char(div, c, space);
				c = space;
			}
			if(is_space(c)) 
				last_space = c;

			c = next_char(c);
		}

		if(last_space != null) {
			let line_break = make_char('\n');
			replace_char(div, last_space, line_break);
			c = next_char(line_break);
		}
	}
}

 var test_str = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta, culpa itaque, sapiente cumque voluptatum vero quaerat obcaecati molestias animi sint minus facere corporis cupiditate facilis ipsa aliquid, aperiam tempora fugit voluptatem! Quae eum commodi ea enim aliquam earum eveniet cumque Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta, culpa itaque, sapiente cumque voluptatum vero quaerat obcaecati molestias animi sint minus facere corporis cupiditate facilis" /* ipsa aliquid, aperiam tempora fugit voluptatem! Quae eum commodi ea enim aliquam earum eveniet cumque. Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta, culpa itaque, sapiente cumque voluptatum vero quaerat obcaecati molestias animi sint minus facere corporis cupiditate facilis ipsa aliquid, aperiam tempora fugit voluptatem! Quae eum commodi ea enim aliquam earum eveniet cumque. ";
        
*/

function Timer(display_time = undefined)
{
	var timer_running = false;	
	var beg_time;
	var curr_time;

	this.start_timer = start_timer;
	this.get_time = get_time;
	this.stop_timer = stop_timer;
	this.is_running = is_running;
	this.reset_timer = reset_timer;

	function reset_timer() {
		curr_time = 0;
		display_time();
	}

	function start_timer() {
		let D = new Date();
		beg_time = D.getTime();
		timer_running = true;

		if(display_time)
			display_time_loop();
	}

	function get_time() {
		if(timer_running) {
			let D = new Date();
			curr_time = D.getTime() - beg_time;
			return to_seconds(curr_time);
		} else 
			return to_seconds(curr_time);
	}

	function stop_timer() {
		if(timer_running) {
			let D = new Date();
			curr_time = D.getTime() - beg_time;
			timer_running = false;
		}
	}

	function to_seconds(t) {
		return Math.round(t/1000);	
	}

	function is_running() {return timer_running; };	

	function display_time_loop() {
		display_time();
		if(timer_running)
			setTimeout(display_time_loop, 100);	
	}
}


function Stats_Interface(Typing_Test) 
{	
	var wpm_dataset = [];

	this.compute_stats = compute_stats;
	this.reset = reset;
	this.plot_stats = plot_stats;

	function compute_stats(start_char, end_char, time_passed = null, add_to_dataset = true)
	{
		let char_total, char_right, char_wrong, char_extra, char_missed, char_wpm_correct;
		char_total = char_right = char_wrong = char_extra = char_missed = char_wpm_correct = 0;

		let curr_word_correct, curr_word_total;
		let wpm = null;
		
		let c = start_char;
		while(c != end_char) {
			let kind = get_char_class(c);

			char_total += 1;
			if(kind == "right")
				char_right += 1;
			else if(kind == "wrong")
				char_wrong += 1;
			else if(kind == "extra")
				char_extra += 1;
			else if(kind == "missed")
				char_missed += 1;

	 		if(beg_of_word(c)) 
				curr_word_correct = curr_word_total = 0;
			if(beg_of_word(c) || mid_of_word(c) || end_of_word(c)) {
				curr_word_total += 1;
				if(end_of_word(c))
					curr_word_correct += 1;
				else 
					curr_word_correct += (kind == "right") ? 1 : 0;
			}
			if(end_of_word(c)) {	
				if(curr_word_correct == curr_word_total)
					char_wpm_correct += curr_word_correct;
			}

			c = next_char(c);
		}

		if(time_passed != null) {
			if(time_passed >= 2) {
				wpm = Math.round((char_wpm_correct / 5) / (time_passed / 60));
				wpm_dataset.push([wpm, time_passed]);
			} else 
				wpm = 0;
			
		}

		return {
			"total": char_total,
			"right": char_right,
			"wrong": char_wrong,
			"extra": char_extra,
			"missed": char_missed,
			"wpm_correct": char_wpm_correct,
			"wpm" : wpm,
		};
	}

	function reset()
	{
		wpm_dataset = [];
	}

	function plot_stats()
	{
		let wpm_data = wpm_dataset.map(function (data_point) {return data_point[0];});
		let time_data = wpm_dataset.map(function (data_point) {return data_point[1];});

		var data = [{
			x: time_data,
			y: wpm_data,
			mode: "lines", 
			type: "scatter",
		}];
		
		//alert(last_elt(time_data));

		var layout = {
			xaxis: {range: [0, last_elt(time_data)],
					title: "Time (in seconds)"},
			yaxis: {range: [0, max(wpm_data)],
					title: "WPM"},
			title: "Variation of average wpm during test",
		};
		
		Plotly.newPlot("myPlot", data, layout);


		function max(array) {
			return array.reduce(function (a, b) {return (a > b) ? a : b;} );
		}

		function last_elt(array) 
		{
			return array[array.length -1]
		};
	}
}


function make_Typing_Test(Typing_Division, Restart_Button)
{
	var Test_Div = Typing_Division;

    var test_state = "none";
    var target = null;

	var line_length = 70;
	var visible_before = 2;
	var visible_total = 5;
	var show_live_wpm = true;

	var test_mode = null;	
	this.set_test_mode = function (mode, value = undefined) 
	{
		if(test_state != "running") {
			test_mode = [mode, value]; 	
			Test_Timer.reset_timer();
		}
	};

	function get_TestModeType() {return test_mode[0] };
	function get_TestModeVal() {return test_mode[1] };

	var test_string = null;
	this.set_test_string = function (s) 
	{
		if(test_state != "running") {
			test_string = s; 
			load_text(test_string);
		}
	};

    this.start_test = start_test;
    this.stop_test = stop_test;
	this.ready_test = ready_test;


	var Test_Timer = new Timer(function () {
		if(get_TestModeType() == "timed")
			setTimerDisplay(get_TestModeVal() - Test_Timer.get_time());
		else
			setTimerDisplay(Test_Timer.get_time);
	});

	var Test_Stats = new Stats_Interface(Test_Div);

	const selection  = window.getSelection();
    function set_cursor(c) {selection.collapse(target); };
	function hide_cursor() {selection.empty(); };

	

	function ready_test() 
	{
		load_text(test_string);

		test_state = "ready";
		Test_Timer.reset_timer();

		Test_Stats.reset();
		display_wpm();

		Test_Div.focus();

	}

    function start_test() 
    {
		test_state = "running";
        target = first_char(Test_Div);
        set_cursor(target);

		Test_Timer.start_timer();
		if(get_TestModeType() == "timed")
			timed_mode_check_loop();
		display_wpm();
    }

    function stop_test()
    {
        test_state = "finished";
		hide_cursor();	
		Test_Timer.stop_timer();
		display_wpm();
		Test_Stats.plot_stats();

    }

    
    function process_input(input)
    {
        if(input_type(input) == "invalid")
            return;

        if(input_type(input) == "character") {
            if (mid_of_word(target) || beg_of_word(target)) {
                if (char_has_value(target, input))
                    kind = "right";
                else
                    kind = "wrong";

                set_char_class(target, kind);
                target = next_char(target);

            } else if (end_of_word(target)) {
                let kind = "extra";

                let extra_char = make_char(input);
                set_char_class(extra_char, kind);
                insert_before(Test_Div, extra_char, target);
				
				refresh_word_wrapping();
            }

        } else if (input_type(input) == "whitespace") {
            if(beg_of_word(target))
                return;
            else if (mid_of_word(target) || end_of_word(target)) {
                while(!end_of_word(target)) {
                    set_char_class(target, "missed");
                    target = next_char(target);
                }
                
                target = next_char(target); //what do we do about the space
            }
        } else if (input_type(input) == "backspace") {
            if(mid_of_word(target)) {
                target = prev_char(target);
                set_char_class(target, "ref");

            } else if (end_of_word(target)) {
                let kind = get_char_class(prev_char(target));

                if(kind == "extra") {
                    delete_char(prev_char(target));
					refresh_word_wrapping();
                } else {
                    target = prev_char(target);
                    set_char_class(target, "ref");
                }
            } else if(beg_of_word(target)) {
                if(prev_char(target) == null)
                    return;
                    
                target = prev_char(target); //what do we do about the space
                
                while(get_char_class(prev_char(target)) == "missed") {
                    target = prev_char(target);
                    set_char_class(target, "ref");
                }
            }
        }


		if(target == null) {
			stop_test();
			return;
		}

        set_cursor(target);
		refresh_scrolling();

    }

	function timed_mode_check_loop()
	{
		if(test_state == "running" && get_TestModeType() == "timed") {
			if(Test_Timer.get_time() >= get_TestModeVal())
				stop_test();
			else
				setTimeout(timed_mode_check_loop, 100);
		}
	}

	function display_wpm()
	{
		function set_wpm_element(wpm) {
			document.getElementById("wpmcounter").innerHTML = wpm;
		}

		if(test_state == "ready") 
			set_wpm_element(0);
		else if(test_state == "running") {
			if(show_live_wpm) {
				setTimeout(display_wpm, 1000);
				let wpm = Test_Stats.compute_stats(first_char(Test_Div), target, Test_Timer.get_time())["wpm"];
				set_wpm_element(wpm == null ? 0 : wpm);
			}

		}
		else if(test_state == "finished") {
			let wpm = Test_Stats.compute_stats(first_char(Test_Div), target, Test_Timer.get_time())["wpm"];
			set_wpm_element(wpm);
		}
	}

	
	function refresh_scrolling() {	
		let before = visible_total - 1;
		let c = target;
		while((c = next_line(c)) != null && before > visible_before) {
			before--;
		}
		console.log(before);

		let target_line = 1;
		c = target;
		while((c = prev_line(c)) != null)
			target_line++;

		let i = 1;
		c = first_char(Test_Div);
		while(i < target_line - before) {
			set_line_visibility(c, false);
			c = next_line(c);
			i++;
		}
		
		for(let i = 1; i <= visible_total; i++) {
			set_line_visibility(c, true);
			c = next_line(c);
		}

		while(c != null) {
			set_line_visibility(c, false);
			c = next_line(c);
		}
		
	}

	function refresh_word_wrapping() {
		if(target == null)
			word_wrap(Test_Div, first_char(Test_Div), null, line_length);
		else {
			target = char_to_index(Test_Div, target);
			word_wrap(Test_Div, first_char(Test_Div), null, line_length);
			target = index_to_char(Test_Div, target);
		}
	}


 	function load_text(s)
    {
		Test_Div.innerHTML = "";
        for(let c of s) {
            let new_char = make_char(c);
            set_char_class(new_char, "ref");
            append_char(Test_Div, new_char);
        }

		refresh_word_wrapping();
		refresh_scrolling();

	}

    //Getting the type of the input
    function input_type(input)
    {
        if (input == "whitespace")
            return "whitespace";
        else if (input == "backspace")
            return "backspace";
        else if(input == "invalid")
            return "invalid";
        else
            return "character";
    }

    document.addEventListener("keypress", function (evt) {
        evt.preventDefault();

		if(test_state == "ready")
			start_test();
		
		if (test_state == "running") {	
			if (evt.key == " ")
				input = "whitespace";
			else if (evt.key == "Enter")
				input = "invalid";
			else 
				input = evt.key;
        	process_input(input);
		}
				
    });
    
    document.addEventListener("keydown", function (evt) {
		if(test_state == "running") {	
			if(evt.key == "Backspace") {
				evt.preventDefault();
				input = "backspace";
			} else 
				input = "invalid";

			process_input(input);
		}
	});

	Restart_Button.addEventListener("click", function (evt) {
		if(test_state == "running")
			stop_test();
		ready_test(test_str);
	});

}

var Text = document.getElementById("typing_window");
var Restart_Button = document.getElementById("rstbtn");

Test = new make_Typing_Test(Text, Restart_Button);
Test.set_test_string(test_str);
Test.set_test_mode("timed", 20);
Test.ready_test();

