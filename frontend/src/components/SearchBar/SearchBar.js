import { useState } from "react";
import "./SearchBar.css"
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

const SearchBar = () => {

    const [city, setCity] = useState('');
    const allSpots = useSelector(state => state.spots);
    const [searchResults, setSearchResults] = useState('');
    const history = useHistory();


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
        setSearchResults('');
        history.push(`/${city}`);
        // history.push("/Miami");
    }


    return (
        // <nav class="navbar bg-body-tertiary">
        <div>
            <div class="container-fluid" style={{ maxWidth: '400px', marginTop: '-4.8vh', marginBottom: '1vh' }}>
                <form class="d-flex" role="search">
                    <input class="form-control me-2" type="search" placeholder="Search by city" aria-label="Search" style={{ borderRadius: '20px', borderColor: 'lightseagreen' }} onChange={(e) => setCity(e.target.value)} />
                </form>
            </div>

            {searchResults && city && (
                <ul class="list-group" style={{
                    position: 'absolute',
                    width: '23.7rem',
                    maxHeight: '15rem',
                    overflow: 'auto',
                    zIndex: '100',
                    marginLeft: '23rem'
                }}>
                    {searchResults.map(spot => {
                        return (
                            <li style={{
                                cursor: "pointer",
                                display: 'flex',
                            }} class="list-group-item list-group-item-action" onClick={(e) => handleSearchSelection(e, spot.city)}>
                                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {/* {spot.name}
                                    <small><br></br>{spot.city}</small> */}
                                    {spot.city}
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
