const infinityDirective = {
  /**
   * 디렉티브가 처음 엘리먼트에 바인딩 될 때 한번만 호출 됩니다.
   * @param {*} el 디렉티브가 바인딩된 엘리먼트.
   * @param {*} binding 바인딩 데이터
   */
  bind: function (el, { value }) {
    const { callback, hitw, hitmw } = value
    if (!callback) {
      throw new Error('Invalid Operation Error : You must provide a callback function.')
    }

    // 임계점에 도달하고 나서 이후에도 계속 next가 호출되는 것을 방지하기 위한
    // 마지막에 도달한 임계점 위치 저장
    let lastHitPoint = 0

    // HTMLElement에 onscroll 이벤트의 핸들러 함수 등록
    el.addEventListener(
      'scroll',
      (el.__infinity_scroll_handler__ = (e) => {
        const {
          scrollTop,
          scrollHeight, // content height
          clientHeight, // view port height
        } = e.target

        const scrollBottom = scrollTop + clientHeight
        // 임계점을 계산하기 위한 가중치
        const hitMinWeight = hitmw ?? 500
        const hitWeight = hitw ?? clientHeight * 2
        // 임계점 계산, 다음 페이지를 가져와야 하는 지점
        const hitPoint = scrollHeight - (hitWeight > hitMinWeight ? hitWeight : hitMinWeight)

        if (
          // 임계점에 도달하였는지 여부 확인
          scrollBottom >= hitPoint &&
          // 처음 진입하는 임계점일 경우에만
          lastHitPoint < hitPoint
        ) {
          lastHitPoint = hitPoint
          callback()
        }
      })
    )
  },
  /**
   * 디렉티브가 엘리먼트로부터 언바인딩된 경우에만 한번 호출됩니다.
   * @param {*} el 디렉티브가 바인딩된 엘리먼트.
   */
  unbind: (el) => {
    if (el.__infinity_scroll_handler__) {
      // Remove Event Listeners
      el.removeEventListener('scroll', el.__infinity_scroll_handler__)
      el.__infinity_scroll_handler__ = null
    }
  },
}

export default infinityDirective
