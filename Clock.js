import { useState, useEffect } from "react";

const Counter = (props) => {
	const [time, setTime] = useState(0);

	useEffect(() => {
		setInterval(() => {
			setTime(prevTime => prevTime + 1);
		}, 1000);
	}, []);

	const getTime = () => {
		let copy = time;
		let hour = Math.floor(copy / (60 * 60));
		copy = copy - (hour * (60 * 60));
		let minute = Math.floor(copy / 60);
		copy = copy - (minute * 60);

		if (hour / 10 < 1) {
			hour = `0${hour}`;
		} if (minute / 10 < 1) {
			minute = `0${minute}`;
		}
		
		return `${hour}:${minute}:${copy}`;
	}

	return(
		<div>
			<div>
				<h1 style={{display: "flex", justifyContent: "center"}}>{getTime()}</h1>
			</div>

			<div style={{display: "flex", justifyContent: "space-evenly"}}>
				<Timer time={time} />
			</div>
		</div>
	);
}

const BinaryBlock = (props) => {
	const getColor = () => {
		if (props.state) {
			return props.color;
		} else {
			return "white";
		}
	}

	return (
		<div style={{backgroundColor: `${getColor()}`, width: "100px", height: "100px", border: "1px solid black"}}>
		</div>
	)
}

const TimerRow = (props) => {
	const [state, setState] = useState([]);

	useEffect(() => {
		setState(props.state());
	}, [props.time]);

	return(
		<>
			{state.map(value => {
				return(
					<BinaryBlock color={props.color} state={value} />
				);
			})}
		</>
	);
}

const Timer = (props) => {
	const [seconds, setSeconds] = useState([-1, 0, 0, 0, 0, 0, 0]);
	const [minutes, setMinutes] = useState([0, 0, 0, 0, 0, 0, 0]);
	const [hours, setHours] = useState([0, 0, 0, 0, 0, 0, 0]);


	const calc = (f=seconds, f_call=setSeconds) => {
		let copy = [false, false, false, false, false, false];
		let f_copy = f;

		if (f === seconds) {
			f_copy[0] = f_copy[0] + 1;
		} else {
			let dec = 0;
			let use = seconds;
			let setUse = setSeconds;
			if (f === hours) {
				use = minutes;
				setUse = setMinutes;
			}
			for (let i = 0; i < f_copy.length; i++) {
				dec = dec + (use[i] * (2 ** i));
			}

			if (dec % 60 === 0 && dec > 0) {
				f_copy[0] = f_copy[0] + 1;
				use = [0, 0, 0, 0, 0, 0, 0];
				setUse(use);
			}
		}

		for (let i = 1; i < f_copy.length; i ++) {
			if(f_copy[i - 1] == 2) {
				f_copy[i - 1] = 0;
				f_copy[i] = f_copy[i] + 1;
			}
		}

		f_call(f_copy);

		for (let i = 0; i < f_copy.length; i++) {
			copy[i] = false;
			if (f_copy[i]) {
				copy[i] = true;
			}
		}

		return copy;
	};

	return(
		<>
			<div>
				<TimerRow color="black" state={calc} time={props.time} />
			</div>

			<div>
				<TimerRow color="red" state={() => calc(minutes, setMinutes)} time={props.time} />
			</div>

			<div>
				<TimerRow color="green" state={() => calc(hours, setHours)} time={props.time} />
			</div>
		</>
	)
}

export default Counter;
