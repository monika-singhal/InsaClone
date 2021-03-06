import React,{useEffect,useState,useContext} from 'react';
import { useParams } from 'react-router';
import { UserContext } from '../../App';

const Profile = ()=>{
    const [userProfile,setProfile] = useState(null)
    const {state,dispatch} = useContext(UserContext)
    const {userid}= useParams()
    const [showfollow,setshowFollow] = useState(state?!state.following.includes(userid):true)
    console.log(userid)
    
    useEffect(()=>{
        fetch(`http://localhost:5002/user/${userid}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result)
            // dispatch({type:"UPDATE",payload:})
            setProfile(result)
        })


     },[])
    
     const followUser = ()=>{
        fetch('http://localhost:5002/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
        
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
             localStorage.setItem("user",JSON.stringify(data))
             setProfile((prevState)=>{
                 return {
                     ...prevState,
                     user:{
                         ...prevState.user,
                         followers:[...prevState.user.followers,data._id]
                        }
                 }
             })
             setshowFollow(false)
        })
    }
    
    const unfollowUser = ()=>{
        fetch('http://localhost:5002/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
             localStorage.setItem("user",JSON.stringify(data))
            
             setProfile((prevState)=>{
                const newFollower = prevState.user.followers.filter(item=>item != data._id )
                 return {
                     ...prevState,
                     user:{
                         ...prevState.user,
                         followers:newFollower
                        }
                 }
             })
              setshowFollow(true)
             
        })
    }
    
    
    return (
       
        <>
        {userProfile 
        ?
        <div style={{maxWidth:"550px",margin:"0px auto"}}>
            <div style={{
                display:"flex",
                justifyContent:"space-around",
                margin:"90px 0px",
                borderBottom:"1px solid grey"
            }}>
                <div>
                    <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
                    src={userProfile.user.pic}/>

                </div>
                <div>
                    <h4> {userProfile.user.name}</h4>
                    <h5> {userProfile.user.email}</h5>
                    <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                        <h6>{userProfile.posts.length}</h6>
                        <h6>{userProfile.user.followers.length}</h6>
                        <h6>{userProfile.user.following.length}</h6>
                    </div>
                    {
                        showfollow?<button class="btn waves-effect waves-light"
                onClick={()=>followUser()}>
                 Follow
               </button>
               :
               <button class="btn waves-effect waves-light"
                onClick={()=>unfollowUser()}>
                 unFollow
               </button>
                    }
                    
              
                </div>
            </div>
        <div className="gallery">
        {
                   userProfile.posts.map(item=>{
                       return(
                        <img key={item._id} className="item" src={item.photo} alt={item.title}/>  
                       )
                   })
        }
        
        </div>
        </div>

        :<h2> Loading.....</h2>
        }
        
        </>
    )
}
export default Profile