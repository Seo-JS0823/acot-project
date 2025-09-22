// TagFactory 객체 리터럴의 Class 버전
/**
 * 사용법
 * 
 * @example
 * let divTag = new TagFactory(
 *    'div',
 *    {
 *       class:'container',
 *       style: {
 *          width:'10rem',
 *          height:'10rem'
 *       }
 *    },
 *    '자바스크립트'
 * );
 */
class TagFactory {
   constructor(tag, attrs = {}, textContent = '') {
      // 태그 생성
      this.element = document.createElement(tag);
      // 속성 추가
      this.#setAttributes(attrs);
      // text 추가
      this.element.textContent = String(textContent || '');
   }

   // TagFactory 비공개 메서드, 속성을 추가하는 역할이다.
   // 이 함수는 생성자에서 호출하고 있다.
   #setAttributes(attrs) {
      // 생성자에서 받은 attrs가 null이 아니라면 실행한다.
      if(attrs !== null) {
         // attrs 객체를 key, value로 분리
         for(const [key, value] of Object.entries(attrs)) {
            // key에 style이 포함되어 있고 동시에 그 value값이 object라면 실행한다.
            if(key === 'style' && typeof value === 'object') {
               // 그 value를 다시 styleName, styleValue로 분리
               for(const [styleName, styleValue] of Object.entries(value)) {
                  // 생성된 HTMLElement에 style을 추가한다.
                  this.element.style[styleName] = styleValue;
               }
            } else {
               // key가 style이 아니라면 setAttribute로 넣는다.
               this.element.setAttribute(key, value);
            }
         }
      }
   }
   
   // TagFactory 로 객체 생성후 나중에 속성을 추가하고싶을 경우
   addAttributes(attrs) {
      this.#setAttributes(attrs);
      return this;
   }

   // 생성자에서 생성된 HTMLElement에 자식 태그를 추가한다.
   // 메서드 체이닝 지원하니 순서대로 넣기 편하다.
   addChild(childTag) {
      // 파라미터로 받은 childTag가 HTMLElement 라면 실행
      if(childTag instanceof HTMLElement) {
         this.element.appendChild(childTag);
      // TagFactory Class를 받는 것도 지원한다.
      // getTag() 메서드로 넣을 수 있다.
      } else if(childTag instanceof TagFactory) {
         this.element.appendChild(childTag.getTag());
      } else {
         // HTMLElement도 아니고 TagFactory Class도 아니면 예외를 던진다.
         throw new Error('유효하지 않은 HTML 태그입니다.');
      }
      // 메서드 체이닝
      return this;
   }

   // 최종적으로 생성된 HTMLElement 태그를 반환한다.
   getElement() {
      return this.element;
   }
}

/* ================================================== */

// TagFactory-ver2 에서 필요없는 것 버리고 역할을 간단히 해서 다시 만들었다.
class TagContainer {
   // 초기 생성된 상태
   constructor() {
      this.virtual = document.createDocumentFragment();
      this.virtualArray = [];
   }

   // add 함수로 HTMLElement를 받는다.
   // TagFactory Class도 받을 수 있다.
   add(tag) {
      if(tag instanceof HTMLElement) {
         this.virtualArray.push(tag);
      } else if(tag instanceof TagFactory) {
         this.virtualArray.push(tag.getTag());
      } else {
         throw new Error('유효하지 않은 HTML 태그입니다.');
      }
      // 메서드 체이닝
      return this;
   }

   // 복사 안하고 오리지널 그대로 반환한다.
   // 이것을 호출하면 this.virtual은 비어있는 상태가 된다.
   getOriginalTag() {
      this.virtualArray.forEach(element => this.virtual.appendChild(element));
      return this.virtual;
   }

   // 복사된 객체를 반환한다.
   getClonedTag() {
      const temporary = this.#fragment();
      this.virtualArray.forEach(element => temporary.appendChild(element.cloneNode(true)));
      return temporary;
   }

   // 초기화한다.
   init() {
      this.virtual = document.createDocumentFragment();
      this.virtualArray = [];
      // 메서드 체이닝
      return this;
   }

   // 배열 사이즈를 반환한다.
   size() {
      return this.virtualArray.length;
   }

   #fragment() {
      return document.createDocumentFragment();
   }
}

/* ================================================== */

// TagFactory Class 또는 HTMLElement 를 받아서 그것에 이벤트를 등록하거나 제거한다.
class TagEvent {
   constructor(tag) {
      // 이벤트 리스너를 등록할 태그를 등록한다.
      this.#setTag(tag);
   }

   // 태그를 등록하는 비공개 메서드
   #setTag(tag) {
      if(tag instanceof HTMLElement) {
         this.targetTag = tag;
      } else if(tag instanceof TagFactory) {
         this.targetTag = tag.getElement();
      } else {
         throw new Error('유효하지 않은 HTML 태그입니다.');
      }
   }

   // 등록되어 있는 태그를 바꾼다.
   changeTag(tag) {
      this.#setTag(tag);
   }

   // 이벤트 등록
   addEvent(event, callback) {
      this.#validateParams(event, callback);
      this.targetTag.addEventListener(event, callback);
      // 메서드 체이닝
      return this;
   }

   // 이벤트 삭제
   removeEvent(event, callback) {
      this.#validateParams(event, callback);
      this.targetTag.removeEventListener(event, callback);
      // 메서드 체이닝
      return this;
   }

   getElement() {
      return this.targetTag;
   }

   // 파라미터가 정확한 타입으로 들어오는지 검사
   #validateParams(event, callback) {
      if(typeof event !== 'string' || typeof callback !== 'function') {
         throw new TypeError(`event: Only 'string' => ${typeof event}, callback: Only 'function' => ${typeof callback}`);
      }
   }

}

// 모달 클래스
// 메서드 체이닝
class Modal {
   // 생성자에서 TagFactory의 div를 가져옴
   // 초기 생성자 상태에서 this.modal 의 타입은 TagFactory Type
   constructor(className = '', flag) {
      if(flag === true) {
      	this.modal = this.#fragment(className);
      } else {
		this.modal = document.getElementById(className);
	  }
   }

   // 모달용 태그를 받아서 오픈하는 함수
   open(tag, display = '', flag) {
      if(tag instanceof HTMLElement && flag === true) {
         tag.style.display = display;
      } else if(tag instanceof HTMLElement && flag === false) {
		tag.style.opacity = 1;
		tag.style.visibility = 'visible';
	  }
   }

   // 모달용 태그를 받아서 클로즈하는 함수
   close(tag, flag) {
      if(tag instanceof HTMLElement && flag === true) {
         tag.style.display = 'none';
      } else if(tag instanceof HTMLElement && flag === false) {
		 tag.style.opacity = 0;
		 tag.style.visibility = 'hidden';
	  }
   }

   // 키보드 누르는 모달 오픈 이벤트
   openKeyEvent(keys = []) {
      if(Array.isArray(keys) && keys.length === 0) return this;

      const keyboardHandler = (e) => {
         const press = this.#keyEventValidate(e, new Set(keys));
         if(press) {
            this.open(this.modal.getElement());
         }
      }

      document.addEventListener('keydown', keyboardHandler);
      return this;
   }

   // 키보드 누르는 모달 클로즈 이벤트
   closeKeyEvent(keys = []) {
      if(Array.isArray(keys) && keys.length === 0) return this;

      const keyboardHandler = (e) => {
         const press = this.#keyEventValidate(e, new Set(keys));
         if(press) {
            this.close(this.modal.getElement());
         }
      }

      document.addEventListener('keydown', keyboardHandler);
      return this;
   }
   
   // 키보드 입력과 배열로 받은 동시 입력키를 비교해서 같으면 true
   #keyEventValidate(e, current) {
      let press = new Set();
      if(e.ctrlKey) press.add('Control');
      if(e.shiftKey) press.add('Shift');
      if(e.altKey) press.add('Alt');
      
      press.add(e.key);

      console.log(press);

      const target = current;

      if(target.size === press.size && [...target].every(k => press.has(k))) { 
         return true;
      } else {
         return false;
      }
   }

   // 버튼 태그에 모달 열기 이벤트 추가
   openBtnEvent(tag, event) {
      new TagEvent(tag).addEvent(event, () => {
         this.modal.getElement().style.display = 'block';
      });
      return this;
   }

   // 버튼 태그에 모달 닫기 이벤트 추가
   closeBtnEvent(tag, event) {
      new TagEvent(tag).addEvent(event, () => {
         this.modal.getElement().style.display = 'none';
      });
      return this;
   }

   // 모달 태그 자체에 이벤트 추가
   addEvent(event, callback) {
      new TagEvent(this.modal).addEvent(event, callback);
      return this;
   }

   // 모달 태그 자체에 등록된 이벤트 제거
   removeEvent(tag, event, callback) {
      new TagEvent(tag).removeEvent(event, callback);
      return this;
   }

   // ModalStyle의 기본 모달 스타일 등록
   setDefaultModalStyle() {
      this.modal.addAttributes(ModalStyle.defaultStyle());
      return this;
   }

   // ModalStyle의 기본 모달 스타일 + 사용자 지정 스타일 등록
   setCustomModalStyle(options = {}) {
      this.modal.addAttributes(ModalStyle.customStyle(options));
      return this;
   }

   // 최종 반환
   getElement() {
      return this.modal.getElement();
   }

   // 초기 생성자에서 기본 태그 만드는 함수
   #fragment(className = '') {
      const attrs = className ? { class:className } : {};
      return new TagFactory('div', attrs);
   }

}

// 기본 모달 스타일을 담고있는 객체 리터럴
// 사용자 지정 스타일 추가 가능
const ModalStyle = {
   // 디폴트 최상위 모달 스타일
   defaultStyle() {
      const defaultStyle = {
         id:'parent-modal',
         style: {
            display:'flex',
            position:'fixed',
            top:0,
            width:'100%',
            height:'100%',
            fontSize: '5rem',
            color:'white',
            alignItems:'center',
            justifyContent:'center',
            transition:'opacity 1s ease, visibility 1s ease',
            opacity: 0,
            visibility: 'hidden',
            backgroundColor:'rgba(0,0,0,0.5)'
         }
      };
      return defaultStyle;
   },
   // 디폴트 최상위 모달 커스텀 스타일
   customStyle(options = {}) {
      const customStyle = options || {};
      const baseStyle = ModalStyle.defaultStyle();
      return {...baseStyle, ...customStyle};
   }
}