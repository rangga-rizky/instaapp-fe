import React from 'react';

const ErrorMessage = ({ message }) => (
    <div style={{
        backgroundColor: '#f44336',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        margin: '20px 0',
        fontFamily: 'Arial, sans-serif',
        fontSize: '16px',
        textAlign: 'center',
    }}>
        {message}
    </div>
);

export default ErrorMessage;