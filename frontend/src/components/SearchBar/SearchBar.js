import { useState } from "react";
import "./SearchBar.css"
import { useSelector } from "react-redux";
import { useEffect } from "react";

const SearchBar = () => {

    const [city, setCity] = useState('');
    const allSpots = useSelector(state => state.spots);
    const [searchResults, setSearchResults] = useState('');


    useEffect(() => {
        setSearchResults(Object.values(allSpots).filter(spot => spot.city.toLowerCase().includes(city.toLowerCase())));
    }, [city]);

    // const handleSearchSubmit = (e) => {
    //     e.preventDefault();
    //     Object.values(allSpots).filter(spot => {
    //         if (spot.city === city) {

    //         }
    //     });
    // }

    const handleSearchSelection = (e, city) => {
        e.preventDefault();

    }


    return (
        // <nav class="navbar bg-body-tertiary">
        <div>
            <div class="container-fluid" style={{ maxWidth: '400px', marginTop: '-3.5vh', marginBottom: '1vh' }}>
                <form class="d-flex" role="search">
                    <input class="form-control me-2" type="search" placeholder="Search by city" aria-label="Search" style={{ borderRadius: '20px' }} onChange={(e) => setCity(e.target.value)} />
                    <button class="btn btn-outline-success" type="submit" className="searchButton">S</button>
                </form>
            </div>

            {searchResults && city && (
                <ul class="list-group" style={{
                    position: 'absolute',
                    width: '12.7rem',
                    maxHeight: '15rem',
                    overflow: 'auto',
                    zIndex: '100'
                }}>
                    {searchResults.map(spot => {
                        return (
                            <li style={{
                                cursor: "pointer",
                                display: 'flex'
                            }} class="list-group-item list-group-item-action">
                                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} onClick={(e) => handleSearchSelection(e, spot.city)}>
                                    {spot.name}
                                    <small><br></br>{spot.city}</small>
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
