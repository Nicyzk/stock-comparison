const makeNavLinksSmooth = ( ) => {
    const navLinks = document.querySelectorAll( '.nav-link' );
    Array.from(navLinks).forEach(n => {
      const onLinkSelect =  e => {
        e.preventDefault()
        const yoffSet = 100
        let pos = document.querySelector(n.hash).offsetTop
        pos -= yoffSet
        window.scrollTo({ top: pos, behavior: "smooth" })
      }
      n.addEventListener('click', onLinkSelect)
      n.addEventListener('touchstart', onLinkSelect)
    })
  }
  
const spyScrolling = ( ) => {
  const sections = document.querySelectorAll( '.post-content > section' );

  window.onscroll = ( ) => {
    let scrollPos = document.documentElement.scrollTop || document.body.scrollTop;
    scrollPos += 150
    Array.from(sections).forEach(s => {
      if (s.offsetTop <= scrollPos) {
        const id = s.id 
        document.querySelector( '.active' ).classList.remove( 'active' );
        document.querySelector( `a[href*=${ id }]` ).parentNode.classList.add( 'active' );
      }
    })
  }
}


export { makeNavLinksSmooth, spyScrolling }
