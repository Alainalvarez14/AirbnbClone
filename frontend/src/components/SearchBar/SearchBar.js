import { useState } from "react";
import "./SearchBar.css"
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

const SearchBar = () => {

    const [city, setCity] = useState('');
    const allSpots = useSelector(state => state.spots);
    const [searchResults, setSearchResults] = useState('');
    const history = useHistory();
    const location = useLocation()

    useEffect(() => {
        let results = [];
        Object.values(allSpots).map(spot => {
            if (spot.city.toLowerCase().includes(city.toLowerCase())) {
                if (!results.some(result => result.city.toLowerCase() === spot.city.toLowerCase() && result.state.toLowerCase() === spot.state.toLowerCase())) {
                    results.push(spot);
                }
            }
        })
        setSearchResults(results)
    }, [city]);

    useEffect(() => {
        setCity('');
    }, [location]);

    const handleSearchSelection = (e, city, state) => {
        e.preventDefault();
        setSearchResults('');
        setCity('');
        history.push(`/${city}-${state}`);
    }


    return (
        // <nav class="navbar bg-body-tertiary">
        <div>
            <div class="container-fluid" style={{ maxWidth: '400px', marginTop: '-4.8vh', marginBottom: '1vh' }}>
                <form class="d-flex" role="search">
                    <input class="form-control me-2" type="search" placeholder="Search by city" aria-label="Search" style={{ borderRadius: '20px', borderColor: 'lightseagreen' }} value={city} onChange={(e) => setCity(e.target.value)} />
                </form>
            </div>

            {searchResults && city && (
                <ul class="list-group" style={{
                    position: 'absolute',
                    width: '23rem',
                    maxHeight: '15rem',
                    overflow: 'auto',
                    zIndex: '100',
                    left: '0',
                    right: '0',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                }}>
                    {searchResults.map(spot => {
                        return (
                            <li style={{
                                cursor: "pointer",
                                display: 'flex',
                            }} class="list-group-item list-group-item-action nomadColor buttons" onClick={(e) => handleSearchSelection(e, spot.city, spot.state)}>
                                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {spot.city}, {spot.state}
                                </div>
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>


        // </nav>
    )
}

export default SearchBar;
