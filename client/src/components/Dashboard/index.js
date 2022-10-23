import React, { useState, useEffect } from "react";
import { getMe, addWord, getAddedWord, deleteFavourite, deleteWord, } from '../../utils/API';
import { removeAllFavouritesWord,getAllFavouritesWordIds } from '../../utils/localStorage';
import Auth from '../../utils/auth';
import "./style.css";
import AddWordCard from "../AddWordCard/index.js";
import AddedWords from "../Cards/index.js"
import Box from '@mui/material/Box';
import { responsiveFontSizes } from "@mui/material";

const Dashboard = () => {
  // create state for holding returned api data
  const [userData, setUserData] = useState({});
  const [addedwords, setaddedWords] = useState([]);
  const [allFavouritesWordIds, setAllFavouritesWordIds] = useState(getAllFavouritesWordIds());
  // use this to determine if `useEffect()` hook needs to run again
  // const userDataLength = Object.keys(userData).length;


  // Get User data on dashboard load, retrieving token auth, 
  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) {
          return false;
        }

        const response = await getMe(token);
        if (!response.ok) {
          throw new Error('something went wrong!');
        }

        const user = await response.json();
        console.log(user)
        setUserData(user);
      } catch (err) {
        console.error(err);
      }
    };
    getUserData();
  }, []);


  // Get the word a User has added to the dictionary on dashboard load
  useEffect(() => {
    const getWordData= async () => {

      try {
        const response = await getAddedWord()
        console.log(response)
     if (!response.ok) {
        throw new Error('something went wrong!');
        }

    const addedwords = await response.json();

  
    setaddedWords(addedwords);
  } catch (err) {
    console.error(err); //console.error(`ERROR: ${err}`);

  }
};
getWordData();
  },[]);

  // Remove AllFavourites word from database and local storage 
  const handleDeleteFavourite = async (wordId) => {

    // Find the selected word in the 'AllFavouritesWordIds' state
    const wordToRemove = allFavouritesWordIds.find((word) => word._id === wordId);
    
    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try { // Delete from AllFavourites Schema 
      const response = await deleteFavourite(wordToRemove, token);

      if (!response.ok) {
        throw new Error('unable to FavouriteWord');
      }
     
      console.log(wordToRemove)
      setAllFavouritesWordIds([...allFavouritesWordIds, wordToRemove._id]);
      //remove from local storage 
      removeAllFavouritesWord([...allFavouritesWordIds, wordToRemove._id])
    } catch (err) {
      console.error(err);
    }
  };

// Add word to Dictionary 
  const handleAddWord = async (wordId) => {

      const token = Auth.loggedIn() ? Auth.getToken() : null;

      if (!token) {
        return false;
      }
      try {
        const response = await addWord(wordId, token)
        
        if (!response.ok) {
          throw new Error('unable to addWord');
        }

        // if word successfully Favourites to user's account, Favourite word id to state
        setaddedWords([...addedwords, wordId.wordId]);
      } catch (err) {
        console.log('Unable to setWordList')
      }
  };

// Delete Users added word from Dictionary 
  const handleDeleteWord = async (wordId)=>{
    const token = Auth.loggedIn() ? Auth.getToken() : null;
  
    if (!token) {
      return false;
    }
    try {
      const response = await deleteWord(wordId, token)
      
      if (!response.ok) {
        throw new Error('unable to addWord');
      }
  
      // if word successfully Favourites to user's account, Favourite book id to state
      setaddedWords([...addedwords, wordId.wordId]);
    } catch (err) {
      console.log('Unable to setWordList')
    }
  }

 if(!userData){
  return <h3>Calm ya Farm</h3>
 }

 return (
  <>
  <Box>
    <AddWordCard
      addedwords={addedwords}
      handleDeleteWord={handleAddWord}
    />
    <AddedWords addedwords={addedwords}
      handleDeleteWord={handleDeleteWord}/>
    </Box>
  </>

);
};
    // <div className='text-light bg-dark'>
    //    {/* User AllFavourites words from dictionary to show */}
    //    <form>
    //    <div className="writeFormGroup">
    //       <label htmlFor="fileInput">
    //         <i className="writeIcon fas fa-plus"></i>
    //       </label>
    //       <input id="fileInput" type="file" style={{ display: "none" }} />
    //       <input
    //         className="writeInput"
    //         placeholder="Title"
    //         type="text"
    //         autoFocus={true}
    //       />
    //     </div>
    //     <div className="writeFormGroup">
    //       <textarea
    //         className="writeInput writeText"
    //         placeholder="Tell your story..."
    //         type="text"
    //         autoFocus={true}
    //       />
    //     </div>
    //     <button onClick={() =>handleAddWord()}></button>
    //     </form>
        {/* <div>
          <h2>{userData.map(user=>{
            <div>{user.username}</div>
          })}</h2>
        </div> */}
    {/* <div>
      <h4>
        {allFavouritesWordIds.length
          ? `Viewing ${allFavouritesWordIds.length} AllFavourites ${allFavouritesWordIds.length === 1 ? 'word' : 'words'}:`
          : 'You have no AllFavourites words!'}
      </h4>
      </div>
        {userData.allFavouritesWordIds.map((word) => {
          return (
            <div>
              <allFavouritesCard allFavouritesWords={allFavouritesWordIds}
                    handleDeleteFavourite={handleDeleteFavourite} />
            </div>
                );
        })}

    {/* User added words to dictionary to show */}
    {/* <div className='text-light bg-dark'>
      <h4>
        {addedwords.length
          ? `${userData.username}, you have added ${userData.addedwords.length === 1 ? 'word' : 'words'}:`
          : 'Post some words and see them here!'}
      </h4>
      </div>
        {addedwords.map((addedword) => {
          return (
            <div>
              <AddedCard addedwords={addedwords} 
               handleDeleteWord={handleDeleteWord}/>
              </div>
              )})}  */}
//        </div>       
//         );

// };
// exports file
export default Dashboard