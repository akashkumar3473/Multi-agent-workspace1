from services.agent_runner import run_agent


def run_workflow(
    db,
    project_description,
):

    outputs = []

    agent_order = [
        1,  # Research
        2,  # Architecture
        3,  # Backend
        4,  # Frontend
        5,  # Database
        6,  # DevOps
        7,  # Testing
        8,  # Documentation
    ]

    previous_output = project_description

    for agent_id in agent_order:

        result = run_agent(
            db=db,
            agent_id=agent_id,
            prompt=previous_output,
        )

        outputs.append(result)

        previous_output = result["response"]

    return outputs