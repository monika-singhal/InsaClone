import React,{useState,useEffect} from 'react';
import { Link ,useHistory} from 'react-router-dom';
import M from 'materialize-css';
const Signin = () => {
    const history = useHistory();
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState("");
    const [url, setUrl] = useState(undefined);
    useEffect(()=>{
         if(url)
         {
             uploadFields()
         }
    },[url])
    const uploadpic=(()=>{
        const data = new FormData()
        data.append("file",image)
            data.append("upload_preset","INSTA_CLONE")
            data.append("cloud_name","projects1409")
            fetch("https://api.cloudinary.com/v1_1/projects1409/image/upload",
        {
            method:"post",
            body:data
        })
        .then(res=>res.json())
        .then(data=>{
           setUrl(data.url)
        })
        .catch(err=>{
            console.log(err)
        })
    })
    const uploadFields=()=>{
        if(!
            
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))
            {
                M.toast({html: "Invalid Details",classes:"#c62828 red darken-3"})
                return;
            }
            
        fetch("http://localhost:5002/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                 name,
                 password,
                 email,
                 pic:url
            })
        }).then(res=>res.json())
        .then(data=>{
               if(data.error)
               {
                M.toast({html: data.error,classes:"#c62828 red darken-3"})
               }
               else
               {
                M.toast({html: data.message,classes:"#43a047 green darken-1"})
                history.push('/signin')
            // console.log(data)
               }
        })
        .catch(err=>{
            console.log(err);
        })

    }
    const PostData = ()=>{
   if(image)
   {
       uploadpic()
   }
   else
   {
    uploadFields()
   }
        
    }

    return (
        <div className="mycard">
            <div className="card auth-card">
                <h2>
                    Instagram
                </h2>
                <input type="text"
                placeholder="name"
                value={name}
                onChange={(e)=>setName(e.target.value)}
                />
                <input type="text"
                placeholder="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                />
                <input type="password"
                placeholder="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                />

           <div className="file-field input-field">
            <div className="btn #64b5f6 blue darken-1">
                <span>Uplaod Pic</span>
                <input type="file" onChange={(e)=>setImage(e.target.files[0])} />
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
            </div>
            </div>
                <button class="btn waves-effect waves-light"
                onClick={()=>PostData()}
                >
                 Signup
               </button>
               <h5>
                   <Link to="/signin">Already Have an Account</Link>
               </h5>
            </div>
        </div>
    )
}
export default Signin