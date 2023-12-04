
// タッチデバイス判定
const is_touch_device = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer:coarse)').matches;

const scrollContent = document.querySelector('.js-scroll');
const leftBtn = document.querySelector('.js-scroll-left');
const rightBtn = document.querySelector('.js-scroll-right');

// 自動スクロールの速度
const scrollSpeed = 10;
const scrollFrame = 3;

// スクロール可能な幅と要素の幅
const scrollWidth = scrollContent.scrollWidth;
const clientWidth = scrollContent.clientWidth;

let scrollLeft;

// デバイスを判定し、イベントを振り分け
let startEventName;
let endEventName;

if (is_touch_device) {
	startEventName = 'touchstart';
	endEventName = 'touchend';
} else {
	startEventName = 'mousedown';
	endEventName = 'mouseup';
}

let intervalId;

// 右へボタン
rightBtn.addEventListener(startEventName, () => {

	intervalId = setInterval(() => {

		scrollLeft = scrollContent.scrollLeft;

		// 右端まで行っていないとき動かす
		if (scrollLeft + clientWidth < scrollWidth) {
			scrollContent.scrollLeft += scrollFrame;
		} else {
			clearInterval(intervalId);
		}

	}, scrollSpeed);

})

// 右へボタンを外したとき
rightBtn.addEventListener(endEventName, () => {
	clearInterval(intervalId);
})

// 左へボタン
leftBtn.addEventListener(startEventName, () => {

	intervalId = setInterval(() => {

		scrollLeft = scrollContent.scrollLeft;

		// 左端まで行っていないとき動かす
		if (scrollLeft > 0) {
			scrollContent.scrollLeft -= scrollFrame;
		} else {
			clearInterval(intervalId);
		}

	}, scrollSpeed);

})

// 左へボタンを外したとき
leftBtn.addEventListener(endEventName, () => {
	clearInterval(intervalId);
})




// タッチデバイスではないとき、ドラッグできるようにする
if (!is_touch_device) {
	const draggedEls = document.querySelectorAll('.js-dragged');

	let target;
	draggedEls.forEach((dragged) => {
		dragged.addEventListener('mousedown', e => {
			e.preventDefault();

			target = dragged;
			target.dataset.down = 'true';
			target.dataset.move = 'false';
			target.dataset.x = e.clientX;
			target.dataset.y = e.clientY;
			target.dataset.scrollleft = target.scrollLeft;
			target.dataset.scrolltop = target.scrollTop;
			e.stopPropagation();
		});
		dragged.addEventListener('click', e => {
			if (dragged.detaset != null && dragged.detaset.move == 'true') e.stopPropagation();
		});
	});

	document.addEventListener('mousemove', e => {
		if (target != null && target.dataset.down == 'true') {
			e.preventDefault();
			let move_x = parseInt(target.dataset.x) - e.clientX;
			let move_y = parseInt(target.dataset.y) - e.clientY;
			if (move_x !== 0 || move_y !== 0) {
				target.dataset.move = 'true';
			} else {
				return;
			}
			target.scrollLeft = parseInt(target.dataset.scrollleft) + move_x;
			target.scrollTop = parseInt(target.dataset.scrolltop) + move_y;
			e.stopPropagation();
		}
	});

	document.addEventListener('mouseup', e => {
		if (target != null && target.dataset.down == 'true') {
			target.dataset.down = 'false';
			e.stopPropagation();
		}
	});

}
