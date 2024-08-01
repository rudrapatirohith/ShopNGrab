// import React from 'react'

// function Footer() {
//   return (
//     <footer class="py-1 pt-5">
//       <p className="text-center mt-1 fw-bold">
//         ShopNGrab - 2024-2030, All Rights Reserved
//       </p>
//     </footer>
//   )
// }

// export default Footer


import React from 'react';
import {
  MDBFooter,
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBIcon,
  MDBBtn
} from 'mdb-react-ui-kit';

export default function Footer() {
  return (
    <MDBFooter className='text-center text-white' style={{ backgroundColor: '#E0E3E8' }}>
      <MDBContainer className='pt-4'>
        <section className='mb-4'>
          
          <MDBBtn
            rippleColor="dark"
            color='link'
            floating
            size="lg"
            className='text-dark m-3'
            href='https://www.instagram.com/rohith_rudrapati/'
            role='button'
          >
            <MDBIcon fab className='fa-instagram' />
          </MDBBtn>

          <MDBBtn
            rippleColor="dark"
            color='link'
            floating
            size="lg"
            className='text-dark m-3'
            href='https://www.linkedin.com/in/rudrapati-rohith/'
            role='button'
          >
            <MDBIcon fab className='fa-linkedin' />
          </MDBBtn>

          <MDBBtn
            rippleColor="dark"
            color='link'
            floating
            size="lg"
            className='text-dark m-3'
            href='https://github.com/rudrapatirohith'
            role='button'
          >
            <MDBIcon fab className='fa-github' />
          </MDBBtn>
        </section>
      </MDBContainer>

      <div className='text-center text-dark p-3' style={{ backgroundColor: '#E0E3E8' }}>
      ShopNGrab - 2024-2030, All Rights Reserved
      </div>
    </MDBFooter>
  );
}