import React from 'react';
import { useParams } from 'react-router-dom';

const GenrePage: React.FC = () => {
    const { genreName } = useParams();

    return (
        <div>
            <h1>{genreName?.replace(/-/g, ' ')} Events</h1>
            <p>Here you can find events for {genreName}!</p>
        </div>
    );
};

export default GenrePage;
