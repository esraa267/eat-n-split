import { useState } from "react";
const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];
export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  function handelAddFriend(newFriend) {
    setFriends((curr) => [...curr, newFriend]);
  }
  function handelSelectFriend(friend) {
    setSelectedFriend((curr) => (curr?.id !== friend.id ? friend : null));
  }
  function handelSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelectFirend={handelSelectFriend}
          selectedFriend={selectedFriend}
        />
        {showAddFriend && <AddFriendForm onAdd={handelAddFriend} />}
        <Button handelClick={() => setShowAddFriend((curr) => !curr)}>
          {showAddFriend ? "Close" : "Add friend"}
        </Button>
      </div>
      {selectedFriend && (
        <SplitBillForm friend={selectedFriend} onSplitBill={handelSplitBill} />
      )}
    </div>
  );
}
function FriendsList({ friends, onSelectFirend, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelectFirend={onSelectFirend}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}
function Friend({ friend, onSelectFirend, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button handelClick={() => onSelectFirend(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}
function AddFriendForm({ onAdd }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  function handelSubmit(event) {
    event.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    onAdd(newFriend);
    setName("");
  }
  return (
    <form className="form-add-friend" onSubmit={handelSubmit}>
      <label>🤼Name</label>
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        type="text"
      />
      <label>🖼Image URL</label>
      <input
        value={image}
        onChange={(event) => setImage(event.target.value)}
        type="text"
      />
      <Button>Add</Button>
    </form>
  );
}
function Button({ handelClick, children }) {
  return (
    <button onClick={handelClick} className="button">
      {children}
    </button>
  );
}
function SplitBillForm({ friend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setpaidByUser] = useState("");
  const [whoIsPaid, setwhoIsPaid] = useState(1);
  const paidByFriend = bill ? bill - paidByUser : "";
  function handelSubmit(event) {
    event.preventDefault();
    if (!bill || !paidByUser) return;
    onSplitBill(whoIsPaid === 1 ? paidByFriend : -paidByUser);
  }
  return (
    <form className="form-split-bill" onSubmit={handelSubmit}>
      <h2>Split a bill with {friend.name}</h2>
      <label>💰 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(event) => setBill(Number(event.target.value))}
      />
      <label>♟ Your expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(event) =>
          setpaidByUser(
            Number(event.target.value) > bill
              ? paidByUser
              : Number(event.target.value)
          )
        }
      />
      <label>🙍‍♂️ {friend.name}'s expense</label>
      <input type="text" disabled value={paidByFriend} />
      <label>🤑 Who is paying the bill</label>
      <select
        value={whoIsPaid}
        onChange={(event) => setwhoIsPaid(event.target.value)}
      >
        <option value={1}>You</option>
        <option value={2}>{friend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
