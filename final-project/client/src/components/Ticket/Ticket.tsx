import './Ticket.css';

const Ticket = () => {
  return (
    <>
      <div className='container'>
        <h1>Title</h1>
        <h5>Google map here</h5>
        <p>Description</p>
        <p className='description'>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Esse debitis
          eligendi tempore quaerat facilis possimus error, est officiis quas
          numquam tenetur tempora repellendus minus, ipsum autem iusto magnam
          aspernatur animi.
        </p>
        <div className='container-info'>
          <div className='container-date-attendants'>
            <div className='container-info-attendants'>
              <h5>Attendants</h5>
              <p>1000+</p>
            </div>
            <div className='container-info-date'>
              <h5>Date</h5>
              <p>01/01 - 0000</p>
            </div>
          </div>
          <div className='container-info-location'>
            <h5>Location</h5>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
          </div>
        </div>
        <h2>Ticket Price: 299$</h2>
        <button>Buy Ticket</button>
      </div>
    </>
  );
};

export default Ticket;
