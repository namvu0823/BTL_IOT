import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

import './Header.css'

library.add(fas);

const Header = () => {
  return (
    <div className='header'>
        <div className='logo-header'>
            <FontAwesomeIcon icon="fa-solid fa-fingerprint" />
            <div className='logo-header-title'>Acheckin</div>
        </div>
        <div className='user'>
            <div className='user-name'>Admin</div>
            <FontAwesomeIcon icon="fa-solid fa-user" />
        </div>
    </div>
  )
}

export default Header