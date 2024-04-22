import React from 'react';
import { Link } from 'react-router-dom';
import LOGO from '../assets/mini.png';

const Navbar = () => {
    return (
        <nav>
            {/* <div>
                <Link to="/">
                    <LOGO />
                </Link> */}
            {/* </div>   */}
            <div>
                <Link to="/">Juke Box</Link>
            </div>
        </nav>
    );
};

export default Navbar;
