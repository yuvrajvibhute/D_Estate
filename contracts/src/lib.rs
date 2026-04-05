#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, String, Vec};

#[contracttype]
pub struct Property {
    pub id: u64,
    pub owner: Address,
    pub price: i128,
    pub metadata: String, // e.g. IPFS hash or token URI
    pub active: bool,
}

#[contract]
pub struct DestateContract;

#[contractimpl]
impl DestateContract {
    /// Initialize the counter
    pub fn init(env: Env) {
        if env.storage().instance().has(&symbol_short!("counter")) {
            panic!("Already initialized");
        }
        env.storage().instance().set(&symbol_short!("counter"), &0u64);
    }

    /// Register a new property
    pub fn register_property(env: Env, owner: Address, price: i128, metadata: String) -> u64 {
        owner.require_auth();

        let mut counter: u64 = env.storage().instance().get(&symbol_short!("counter")).unwrap_or(0);
        counter += 1;
        env.storage().instance().set(&symbol_short!("counter"), &counter);

        let property = Property {
            id: counter,
            owner,
            price,
            metadata,
            active: true,
        };

        env.storage().persistent().set(&counter, &property);

        counter
    }

    /// Buy a property
    pub fn buy_property(env: Env, buyer: Address, id: u64) {
        buyer.require_auth();

        let mut property: Property = env.storage().persistent().get(&id).expect("Property not found");
        if !property.active {
            panic!("Property not active");
        }
        if property.owner == buyer {
            panic!("Cannot buy your own property");
        }

        // Ideally, here we would handle transferring XLM tokens
        // For the MVP, we assume the transaction is valid when executed
        // or rely on Freighter/Soroban token transfers inside the contract or via atomic tx.
        
        // Just transfer ownership for the MVP simulation logic when called natively.
        property.owner = buyer;
        property.active = false; // Delist it

        env.storage().persistent().set(&id, &property);
    }

    /// Get a specific property
    pub fn get_property(env: Env, id: u64) -> Property {
        env.storage().persistent().get(&id).expect("Property not found")
    }
}
