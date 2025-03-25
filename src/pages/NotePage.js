import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ReactComponent as ArrowLeft } from '../assets/arrow-left.svg';

const NotePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
  
    let [note, setNote] = useState(null);

    useEffect(() => {
        if (note && id !== 'new' && note.body === '') {
            deleteNote();
        }
        getNote();
    }, [note?.body]);
    

    let getNote = async () => {
        if (id === 'new') return;

        let response = await fetch(`http://127.0.0.1:8000/api/notes/${id}`);
        let data = await response.json();
        setNote(data);
    }

    let createNote = async () => {
        await fetch(`http://127.0.0.1:8000/api/notes/create/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(note),
        });
        navigate('/');
    }

    let updateNote = async () => {
        console.log("Updating Note:", note);
        
        const url = `http://127.0.0.1:8000/api/notes/${id}/update/`;
    
        console.log(`Updating note at: ${url}`);
    
        let response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(note),
        });
    
        if (!response.ok) {
            console.log("Error updating note:", response.status, response.statusText);
            return;
        }
    
        let updatedData = await response.json();
        console.log("Updated note:", updatedData);
    
        getNote();
    };
    

    let handleSubmit = () => {
        console.log("Handle Submit Triggered", note)

        if (id !== 'new' && note.body === '') {
            console.log("Delete Handle Triggered", note.body)
            deleteNote();
        }
        else if  (id !== 'new') {
            updateNote();
        }

        else if (id === 'new' && note !== null) {
            createNote();
        }

        navigate('/');
    }

    

    let deleteNote = async () => {
        
        await fetch(`/api/notes/${id}/delete/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        navigate('/');
    }

    return (
        <>
            <div className="note">
                <div className="note-header">
                    <h3>
                        <ArrowLeft onClick={handleSubmit} />
                    </h3>
                    {id !== 'new' ? (
                        <button onClick={deleteNote}>Delete</button>
                    ) : (
                        <button onClick={handleSubmit}>Done</button>
                    )}
                </div>
                <textarea  onChange={(e) => setNote({ ...note, body: e.target.value })} value={note ? note.body : ''}
            ></textarea>
            </div>
        </>
    );
};

export default NotePage;